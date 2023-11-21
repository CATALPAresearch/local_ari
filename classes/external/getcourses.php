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
 * Class local_ari_get_courses
 *
 * @package     local_ari
 * @copyright   2023 Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class getcourses extends external_api
{
    public static function get_courses()
    {
        global $DB;
        $debug = 'nix';

        // extract and load data
        $query = "
            SELECT id, shortname, fullname
            FROM {course} r
            ;";

        $res = $DB->get_records_sql($query);
        $courses = [];
        foreach ($res as $key => $c) {
            array_push($courses, [
                'id' => $c->id,
                'fullname' => $c->fullname,
                'shortname' => $c->shortname,
            ]);
        }
        //return array('data' => json_encode($debug));
        return array(
            'data' => json_encode($courses),
            //'debug' => json_encode(§debug)
        );
    }



    /**
     * Function to define parameters for courses query
     * @return external_function_parameters
     */
    public static function get_courses_parameters()
    {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array('token' => new external_value(PARAM_INTEGER, '', VALUE_OPTIONAL),)
            ))
        );
    }


    /**
     * Function to define return type for get_courses_execution query
     * @return external_single_structure
     */
    public static function get_courses_returns()
    {
        return new external_single_structure(
            array(
                'data' => new external_value(PARAM_RAW, ''),
                'debug' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL),
            )
        );
    }


    /**
     * Function to enable ajax calls for get_courses_execution
     * @return bool
     */
    public static function get_courses_is_allowed_from_ajax()
    {
        return true;
    }
}
