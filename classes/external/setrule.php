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
 * Class local_ari_get_rules
 *
 * @package     local_ari
 * @copyright   2022 Chiara Sandführ <chiara.sandfuehr@fernuni-hagen.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class setrule extends external_api
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
    public static function set_rule($param) {
        global $CFG, $DB, $USER;
        $debug = 'nix';
        $rule = (array)json_decode($param['rule'], true);
        $res = '';

        // store rule
        $r = new stdClass();
        $r->id = $rule['id'];
        $r->course_id = $param['course_id'];
        $r->title = $rule['title'];
        $r->is_active = $rule['is_active'] == true ? true : false;
        $r->isPerSectionRule = $rule['isPerSectionRule'] == true ? true : false;

        $exists = $DB->record_exists('ari_rule' , [
            'id' => $rule['id'],
            'course_id' => $rule['course_id'],
            ]);
        
        if ($exists != true) {
            $transaction = $DB->start_delegated_transaction();
            $res = $DB->insert_records("ari_rule", [$r]);
            $transaction->allow_commit();
        } elseif ($exists == true) {
            $transaction = $DB->start_delegated_transaction();
            //$res = $DB->set_field("ari_rule", 'id', $rule['id'], (array)$r);
            $res = $DB->update_record("ari_rule", $r);
            $transaction->allow_commit();
        }

        // store conditions
        $condition = $rule['Condition'];
        
        foreach($condition as $cond){
            $r = new stdClass();
            $r->id = (int)$cond['id'];
            $r->rule_id = (int)$rule['id'];
            $context = $DB->get_record_sql("SELECT id FROM {ari_rule_source_context} WHERE name=:name", ['name' => $cond['source_context']]);
            $r->source_context_id = $context->id;
            $r->lm_key = $cond['key'];
            $r->lm_value = $cond['value'];
            $operator = $DB->get_record_sql("SELECT id FROM {ari_rule_operator} WHERE name=:name", ['name' => $cond['operator']]);
            $r->operator_id = $operator->id; 
            
            $exists = $DB->record_exists('ari_rule_condition', ['id' => $cond['id']]);
            if ($exists != true) {
                $transaction = $DB->start_delegated_transaction();
                $res = $DB->insert_records("ari_rule_condition", [$r]);
                $transaction->allow_commit();
            } elseif ($exists == true) {
                $transaction = $DB->start_delegated_transaction();
                $res = $DB->update_record("ari_rule_condition", $r);
                $transaction->allow_commit();
            }
            
        }
        
        
        // store actions
        $action = $rule['Action'];
        foreach($action as $act){
            $r = new stdClass();
            
            $r->rule_id =  (int)$rule['id'];
            $r->section = $act['section'] == null ? 'main' : $act['section'];
            $actor = $DB->get_record_sql("SELECT id FROM {ari_rule_actor} WHERE name=:name", ['name' => $act['actor']]);
            $r->actor_id = $actor->id;
            $r->action_title = $act['action_title'];
            $r->action_text = $act['action_text'];
            $action_type = $DB->get_record_sql("SELECT id FROM {ari_rule_action_type} WHERE name=:name", ['name' => $act['type']]);
            $r->action_type_id = $action_type->id;
            $category = $DB->get_record_sql("SELECT id FROM {ari_rule_action_category} WHERE name=:name", ['name' => $act['category']]);
            $r->action_category_id = $category->id;
            $r->course_id = $rule['course_id'];
            $context = $DB->get_record_sql("SELECT id FROM {ari_rule_target_context} WHERE name=:name", ['name' => $act['target_context']]);
            $r->target_context_id = $context->id;
            $r->dom_content_selector = $act['dom_content_selector'];
            $r->dom_indicator_selector = $act['dom_indicator_selector'];
            $r->viewport_selector = $act['viewport_selector'];
            $timing = $DB->get_record_sql("SELECT id FROM {ari_rule_timing} WHERE name=:name", ['name' => $act['timing']]);
            $r->timing_id = $timing->id;
            $r->delay = $act['delay'];
            $r->priority = $act['priority'];
            $r->repetitions = $act['repetitions'];
            
            $exists = $DB->record_exists('ari_rule_action', ['id' => $act['id']]);
            if ($exists != true) {
                $transaction = $DB->start_delegated_transaction();
                $res = $DB->insert_records("ari_rule_action", [$r]);
                $transaction->allow_commit();
            } elseif ($exists == true) {
                $transaction = $DB->start_delegated_transaction();
                $res = $DB->update_record("ari_rule_action", $r);
                $transaction->allow_commit();
            }
        }

        //return array('data' => json_encode($debug));
        return [
            'success' => true,
            'data' => json_encode($debug)
        ];
    }



    /**
     * Function to define parameters for get_rule_execution query
     * @return external_function_parameters
     */
    public static function set_rule_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure([
                'course_id' => new external_value(PARAM_INTEGER, 'The id of the course where the rule is going to be executed'),
                'rule' => new external_value(PARAM_RAW, 'The adaptation rule.'),
                ]
            )));
    }


    /**
     * Function to define return type for get_rule_execution query
     * @return external_single_structure
     */
    public static function set_rule_returns() {
        return new external_single_structure([
            'success' => new  external_value(PARAM_BOOL, 'Indicates wheter the attempt was successfull or not.'),
            'data' => new external_value(PARAM_RAW, '')
            ] );
    }

    
    /**
     * Function to enable ajax calls for get_rule_execution
     * @return bool
     */
    public static function set_rule_is_allowed_from_ajax() {
        return true;
    }
}