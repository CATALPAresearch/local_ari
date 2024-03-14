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
    public static function get_content_recommendations($data) {
        global $USER, $DB;
        $course_id = $data['course_id'];
        $requests = $data['requests'];
        $result = [];
        $debug = 'nix';
        $query = '';
        foreach($requests as $type => $req){
            switch($type){
                case "rec.safran-like-completed-assignments":  // vertiefe Wissen mit SA, die ähnlich zu den bereits bearbeiteten EAs sind
                    $query = "
                    SELECT DISTINCT
                        -- a2.id,
                        a2.instance_id,
                        a2.instance_url_id,
                        aa1.keyword AS search_term,
                        a2.component,
                        aa1.document_frequency AS score1,
                        a2.document_frequency AS score2
                    FROM (
                        SELECT
                            a1.course_id, a1.keyword, a1.id, a1.document_frequency, a1.instance_url_id
                        FROM mthreeeleven_assign a
                            LEFT JOIN mthreeeleven_assign_grades ag ON a.id = ag.assignment
                            LEFT JOIN mthreeeleven_assign_submission asub ON a.id = asub.assignment
                            LEFT JOIN mthreeeleven_course_modules cm ON a.id = cm.instance
                            LEFT JOIN mthreeeleven_modules m ON m.id = cm.module 
                            LEFT JOIN mthreeeleven_course_sections cs ON cm.section = cs.id
                            JOIN mthreeeleven_ari_content_model a1 ON a1.instance_id = cm.instance
                        WHERE 
                            a1.course_id = :course:id AND
                            ag.userid = :user_id AND 
                            -- asub.status = 'submitted' AND 
                            asub.latest = 1 AND 
                            m.name = :input_component AND
                            cm.visibleoncoursepage = 1 AND
                            m.visible = 1 AND
                            cs.visible = 1
                        ORDER BY a1.document_frequency DESC
                        LIMIT 20
                        ) as aa1
                    JOIN mthreeeleven_ari_content_model a2 ON a2.keyword = aa1.keyword
                    WHERE 
                        aa1.id <> a2.id AND
                        a2.course_id=aa1.course_id AND
                        aa1.instance_url_id <> a2.instance_url_id AND
                        a2.component = :output_component
                    ORDER BY aa1.document_frequency, a2.document_frequency DESC
                    LIMIT :number_of_results
                    ;";
                    $transaction = $DB->start_delegated_transaction();
                    $res = $DB->get_records_sql($query, [
                        'user_id' => $USER->id,
                        'course_id' => $course_id,
                        'input_component' => $req['input_component'],
                        'output_component' => $req['output_component'],
                        'number_of_results' => $req['number_of_results']
                    ]);
                    $transaction->allow_commit();
                    
                    if(isset($res)){
                        foreach($res as $r){

                        }
                    }
                    
                    break;
                case "rec.safran-like-not-completed-assignments": // bearbeite SA, die ähnlich zu den noch nicht bearbeiteten EA sind.
                    break; 
                case "rec.safran-like-longpage-section-XX": 
                    break; 
                case "rec.quiz-like-longpage": // Quiz-Aufgaben zu den bereits gelesenen Abschnitten
                    break;
                case "rec.quiz-like-completed-assignments": 
                    break;
                case "rec.quiz-like-not-completed-assignments": 
                    break;
                case "rec.quiz-like-not-completed-safran": 
                    break;
                case "rec.quiz-like-completed-safran": 
                    break;
                case "rec.all-longpage-of-course-unit": // alle Longpages (i.d.R. Link zur Longpage)
                    break;
                case "rec.all-safran-of-course-unit": 
                    break;
                case "rec.all-assignments-of-course-unit": 
                    break;
                case "rec.all-quizz-of-course-unit": 
                    break;
                case "rec.not-completed-safran": // noch nicht bearbeitetet SA
                    break;
                case "rec.not-completed-assignments":
                    break;
                case "rec.not-completed-longpage":  // longpages that have not been read completly
                    break;
                case "rec.simpler-safran-then-already-completed": // leichtere SA Aufgabe, als die bisher bearbeiteten
                    break;
                case "rec.simpler-assignments-then-already-completed": 
                    break;
                case "rec.simpler-quiz-then-already-completed": 
                    break;
                    
                default:
                    // do nothing
            }
            
        }
        

        //return array('data' => json_encode($debug));
        return array(
            'data' => json_encode($result),
            'debug' => json_encode($debug),
        );
        
    }



    /**
     * Function to define parameters for get_rule_execution query
     * @return external_function_parameters
     */
    public static function get_content_recommendations_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array(
                    'course_id' => new external_value(PARAM_INTEGER, ''),
                    'requests' => new external_value(PARAM_RAW, ''),
                )
            )
        ));
    }


    /**
     * Function to define return type for get_rule_execution query
     * @return external_single_structure
     */
    public static function get_content_recommendations_returns() {
        return new external_single_structure(
            array( 
                'data' => new external_value(PARAM_RAW, ''),
                'debug' => new external_value(PARAM_RAW, '', VALUE_OPTIONAL) 
            )
        );
    }

    
    /**
     * Function to enable ajax calls for get_rule_execution
     * @return bool
     */
    public static function get_content_recommendations_is_allowed_from_ajax() {
        return true;
    }
}