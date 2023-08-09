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

require_once($CFG->libdir.'/externallib.php');

/**
 * Class rule
 *
 * @package     local_ari
 * @copyright   2022 Chiara Sandführ <chiara.sandfuehr@fernuni-hagen.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class rule extends external_api {
    /**
     * Function to fetch rule executions from database
     * @return array
     * @throws required_capability_exception
     * @throws coding_exception
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function get_rule_execution($data) {
        global $CFG, $DB;

        // Define WHERE if optional data is set
        $query_where = '';
        if($data != null) {
            $query_where = ' WHERE rule_id = ' . $data['rule_id'];
        }

        // Define query
        $query = '
            SELECT *
            FROM '.$CFG->prefix.'ari_rule_execution'
            . $query_where . ';';

        // Execute query and fetch results
        $transaction = $DB->start_delegated_transaction();
        $data = $DB->get_records_sql($query, array(
            'id' => $data['id'],
            'rule_id' => $data['rule_id'],
            'execution_date' => $data['execution_date'],
            'user_id' => $data['user_id']
        ));
        $transaction->allow_commit();
        return array('data' => json_encode($data));
    }


    /**
     * Function to save rule executions to database
     * @param $data
     * @return array
     */
    public static function save_rule_execution($data) {
        global $USER, $CFG, $DB;

        // Define query data
        $rule_execution = new stdClass();
        $rule_execution->rule_id = $data["rule_id"];
        $rule_execution->execution_date = $data["execution_date"];
        $rule_execution->user_id = $data["user_id"];

        // Insert data into database
        $transaction = $DB->start_delegated_transaction();
        $result = $DB->insert_record("ari_rule_execution", (array)$rule_execution);
        $transaction->allow_commit();

        return array('response'=> json_encode([$result, $data]));
    }


    /**
     * Function to define parameters for get_rule_execution query
     * @return external_function_parameters
     */
    public static function get_rule_execution_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array('rule_id' => new external_value(PARAM_INTEGER, '', VALUE_OPTIONAL),)
            )));
    }


    /**
     * Function to define parameters for save_rule_execution query
     * @return external_function_parameters
     */
    public static function save_rule_execution_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array(
                    'rule_id' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL),
                    'execution_date' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL),
                    'user_id' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL),
                ))));
    }

    /**
     * Function to define return type for get_rule_execution query
     * @return external_single_structure
     */
    public static function get_rule_execution_returns() {
        return new external_single_structure(
            array( 'data' => new external_value(PARAM_RAW, '') ));
    }

    /**
     * Function to define return type for save_rule_execution query
     * @return external_single_structure
     */
    public static function save_rule_execution_returns() {
        return new external_single_structure(
            array('response' => new external_value(PARAM_RAW, ''))
        );
    }

    /**
     * Function to enable ajax calls for get_rule_execution
     * @return bool
     */
    public static function get_rule_execution_is_allowed_from_ajax() {
        return true;
    }

    /**
     * Function to enable ajax calls for save_rule_execution
     * @return bool
     */
    public static function save_rule_execution_is_allowed_from_ajax() {
        return true;
    }
}

