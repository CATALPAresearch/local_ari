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
     *
     * @return stdClass
     * @throws required_capability_exception
     * @throws coding_exception
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function save_rule_execution($data) {
        global $USER, $CFG, $DB;

        $rule_execution = new stdClass();
        $rule_execution->rule_id = $data["rule_id"];
        $rule_execution->execution_date = $data["execution_date"];

        if ($rule_execution->rule_id != 0) {
            $rule_execution->timemodified =  $data['timemodified'];
        } else {
            $rule_execution->rule_id = null;
            $rule_execution->timecreated =  $data["timecreated"];
            $rule_execution->timemodified = 0;
        }

        $transaction = $DB->start_delegated_transaction();
        $result = $DB->insert_record("ari_rule_execution", (array)$rule_execution);
        $transaction->allow_commit();

        return array('response'=> json_encode([$result, $data]));

    }

    public static function save_rule_execution_is_allowed_from_ajax() {
        return true;
    }

    /**
     *
     * @return external_function_parameters
     */
    public static function save_rule_execution_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array(
                    'rule_id' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL),
                    'execution_date' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL),
                    'timecreated' => new external_value(PARAM_TEXT, '', VALUE_OPTIONAL),
                    'timemodified' => new external_value(PARAM_TEXT, '', VALUE_OPTIONAL),
                ))));
    }

    /**
     *
     * @return external_single_structure
     */
    public static function save_rule_execution_returns() {
        return new external_single_structure(
            array( 'response' => new external_value(PARAM_RAW, '') )
        );
    }
}

