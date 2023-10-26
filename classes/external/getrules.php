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
class getrules extends external_api
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
    public static function get_rules($param) {
        global $CFG, $DB;
        $debug = 'nix';

        // extract and load data
        $query_rules = "
            SELECT *
            FROM {ari_rule} r
            WHERE 
                r.course_id = :course_id
            ;";
        $query_conditions = "
            SELECT rc.id, rc.rule_id, rc.source_context_id, rc.lm_key, rc.lm_value, o.name as operator
            FROM {ari_rule_condition} rc
            JOIN {ari_rule_source_context} sc ON (rc.source_context_id)::integer = (sc.id)::integer
            JOIN {ari_rule_operator} o ON (o.id)::integer = (rc.operator_id)::integer
            ;";
        $query_actions = "
            SELECT 
                ra.id, 
                ra.section,
                ra.rule_id, 
                a.name as actor,
                ra.action_title,	
                ra.action_text,
                att.name as action_type,
                ac.name as action_category,	
                ra.course_id,
                tc.name as target_context,	
                ra.dom_content_selector,	
                ra.dom_indicator_selector,	
                ra.viewport_selector,
                t.name as timing,
                ra.delay,
                ra.priority,	
                ra.repetitions
            FROM {ari_rule_action} ra 
            JOIN {ari_rule_action_type} att ON att.id = ra.action_type_id
            JOIN {ari_rule_action_category} ac ON ac.id = ra.action_category_id
            JOIN {ari_rule_actor} a ON ra.actor_id = a.id
            JOIN {ari_rule_target_context} tc ON ra.target_context_id = tc.id
            JOIN {ari_rule_timing} t ON t.id = ra.timing_id
            ;";

        $transaction = $DB->start_delegated_transaction();
        $rules = $DB->get_records_sql($query_rules, array('course_id' => $param['course_id']));
        $transaction->allow_commit();
        $transaction = $DB->start_delegated_transaction();
        $conditions = $DB->get_records_sql($query_conditions);
        $transaction->allow_commit();
        $transaction = $DB->start_delegated_transaction();
        $actions = $DB->get_records_sql($query_actions);
        $transaction->allow_commit();

        // transform resulting data
        $result = [];
        foreach($rules as $key => $r){
            $result['rule' . $r->id] = [
                "id" => $r->id,
                "active" => true,
                "title" => $r->title,
                "course_id"  => $r->course_id,
                "Condition" => [],
                "Action" => [],
            ];
        }

        foreach($conditions as $key => $c){
            $source_context = $DB->get_record_sql("SELECT name FROM {ari_rule_source_context} WHERE id=:id", ['id' => $c->source_context_id]);
            $condition = [
                "id" => $c->id,
                "source_context" => $source_context->name,
                "key" => $c->lm_key,
                "value" => $c->lm_value,
                "operator" => $c->operator,
            ];
            
            if($result['rule' . $c->rule_id]["Condition"] == null){
                $result['rule' . $c->rule_id]["Condition"] = [];
                array_push($result['rule' . $c->rule_id]["Condition"], $condition);
            }else{
                array_push($result['rule' . $c->rule_id]["Condition"], $condition);
            }     
        }
        // TODO: Some DB fields are missing
        foreach($actions as $key => $a){
            $action = [    
                "actor" => $a->actor,
                "type" => $a->action_type,
                "category" => $a->action_category,
                "action_text" => $a->action_text,
                "action_title" => $a->action_title,
                "target_context" => $a->target_context,
                "moodle_course" => $a->course_id,
                "dom_content_selector" => $a->dom_content_selector,
                "dom_indicator_selector" => $a->dom_indicator_selector,
                "timing" => $a->timing,
                "delay" =>  $a->delay,
                "priority" =>  $a->priority,
                "repetitions" => $a->repetitions,
            ];
            
            if($result['rule' . $a->rule_id]["Action"] == null){
                $result['rule' . $a->rule_id]["Action"] = [];
                array_push($result['rule' . $a->rule_id]["Action"], $action);
            }else{
                array_push($result['rule' . $a->rule_id]["Action"], $action);
            } 
        }
        //return array('data' => json_encode($debug));
        return array('data' => json_encode($result));
        
    }



    /**
     * Function to define parameters for get_rule_execution query
     * @return external_function_parameters
     */
    public static function get_rules_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(
                array('course_id' => new external_value(PARAM_INTEGER, '', VALUE_OPTIONAL),)
            )));
    }


    /**
     * Function to define return type for get_rule_execution query
     * @return external_single_structure
     */
    public static function get_rules_returns() {
        return new external_single_structure(
            array( 'data' => new external_value(PARAM_RAW, '') ));
    }

    
    /**
     * Function to enable ajax calls for get_rule_execution
     * @return bool
     */
    public static function get_rules_is_allowed_from_ajax() {
        return true;
    }
}