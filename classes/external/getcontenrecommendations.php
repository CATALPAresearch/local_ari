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
use external_value;
use external_single_structure;
use required_capability_exception;
use stdClass;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/externallib.php');

/**
 * Class local_ari_get_rules
 *
 * @package     local_ari
 * @copyright   2022 Chiara Sandführ <chiara.sandfuehr@fernuni-hagen.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class getcontentrecommendations extends external_api
{    
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
    public static function get_content_recommendations($param) {
        global $CFG, $DB;
        $debug = 'nix';
        $query = '';
        $transaction = $DB->start_delegated_transaction();
        $actions = $DB->get_records_sql($query);
        $transaction->allow_commit();

        //return array('data' => json_encode($debug));
        return array('data' => json_encode($result));
        
    }



    /**
     * Function to define parameters for get_rule_execution query
     * @return external_function_parameters
     */
    public static function get_content_recommendations_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array('course_id' => new external_value(PARAM_INTEGER, '', VALUE_OPTIONAL),)
            )));
    }


    /**
     * Function to define return type for get_rule_execution query
     * @return external_single_structure
     */
    public static function get_content_recommendations_returns() {
        return new external_single_structure(
            array( 'data' => new external_value(PARAM_RAW, '') ));
    }

    
    /**
     * Function to enable ajax calls for get_rule_execution
     * @return bool
     */
    public static function get_content_recommendations_is_allowed_from_ajax() {
        return true;
    }
}