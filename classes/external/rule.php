<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * @package     local_ari
 * @copyright   2022 Chiara Sandführ <chiara.sandfuehr@fernuni-hagen.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_ari\external;

use external_api;
use external_function_parameters;
use external_multiple_structure;
use external_settings;
use external_value;
use external_single_structure;
use required_capability_exception;
use stdClass;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/externallib.php');

/**
 * Class rule
 *
 * @package     local_ari
 * @copyright   2022 Chiara Sandführ <chiara.sandfuehr@fernuni-hagen.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class rule extends external_api
{
    public static function get_rule_execution_parameters()
    {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array('rule_id' => new external_value(PARAM_INTEGER, '', VALUE_OPTIONAL),)
            ))
        );
    }
    public static function get_rule_execution_returns()
    {
        return new external_single_structure(
            array('data' => new external_value(PARAM_RAW, ''))
        );
    }
    public static function get_rule_execution_is_allowed_from_ajax()
    {
        return true;
    }
    public static function get_rule_execution($data)
    {
        global $DB;

        $query = "SELECT rule_id, count FROM {ari_response_rule_execution}";// WHERE rule_id = :rule_id ;";
        $res = $DB->get_records_sql($query, array(
            //'rule_id' => $data['rule_id'],
            //'execution_date' => $data['execution_date'],
        ));
        return array('data' => json_encode($res));
    }


    public static function set_rule_execution_parameters()
    {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array(
                    'rule_id' => new external_value(PARAM_INT, ''),
                    'course_id' => new external_value(PARAM_INT, ''),
                    'status' => new external_value(PARAM_TEXT, ''),
                )
            ))
        );
    }
    public static function set_rule_execution_returns()
    {
        return new external_single_structure(
            array('response' => new external_value(PARAM_RAW, ''))
        );
    }
    public static function set_rule_execution_is_allowed_from_ajax()
    {
        return true;
    }
    public static function set_rule_execution($data)
    {
        global $USER, $CFG, $DB;
        $date = new \DateTime('now');
    
        $rule_exec = $DB->get_record('ari_response_rule_execution', [
            "user_id" => (int)$USER->id,
            "course_id" => (int)$data["course_id"],
            "rule_id" => (int)$data["rule_id"]
        ]);
        if ($rule_exec) {
            if($data["status"] != $rule_exec->status){
                if($data["status"] == 'condition_met'){
                    $rule_exec->count = $rule_exec->count + 1;
                }
                $rule_exec->status = $data["status"];
                $DB->update_record('ari_response_rule_execution', $rule_exec);
            }
        } else{
            $params = new stdClass();
            $params->user_id = $USER->id;
            $params->course_id = $data["course_id"];
            $params->rule_id = $data["rule_id"];
            $params->status = $data["status"];
            $params->count = 1;
            $DB->insert_record('ari_response_rule_execution', $params);
        }

        // trigger event if rule condition is met
        /* TODO
        if($data["status"] == 'condition_met'){
            $params = array(
                'context' => 999,
                'objectid' => $data["rule_id"]
            );

            $event = \local_ari\event\rule_condition_met::create($params);
            $event->add_record_snapshot('course_modules', 0);
            $event->add_record_snapshot('course', $data["course_id"]);
            //$event->add_record_snapshot('longpage', $page);
            $event->trigger();
        }
        */

        return array('response' => json_encode([
            $rule_exec,
            $data["status"] == 'condition_met',
            
        ]));
    }
}
