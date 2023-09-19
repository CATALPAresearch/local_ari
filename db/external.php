<?php

    /**
     * 
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description The external API for AJAX requests.
     * 
    */

    defined('MOODLE_INTERNAL') || exit(0);
     
    require_once($CFG->libdir . "/externallib.php");

    class local_ari_external extends external_api {

        public static function sendSystemMessage_parameters(){
            return new external_function_parameters(
                array(
                    'subject' => new external_value(PARAM_TEXT, 'The subject of the notification.'),
                    'message' => new external_value(PARAM_TEXT, 'The message that should be send.')                   
                )
            );
        }

        public static function sendSystemMessage($subject, $msg){            
            $return = array();
            $return['result'] = false;
            try{                
                global $CFG, $USER;
                require_login(context_system::instance(), false);
                if(empty($msg) || !is_string($msg)) throw new Exception("No valid message.");  
                $BOT = get_complete_user_data("username", "chatbot", $CFG->mnet_localhost_id, false);
                if(!is_object($BOT) || $BOT === false) throw new Exception("Chatbot not found.");             
                $message = new \core\message\message();
                $message->component = 'moodle';
                $message->name = 'instantmessage';
                $message->userfrom = $BOT;
                $message->userto = $USER;                         
                $message->subject = ucfirst($subject);            
                $message->fullmessageformat = FORMAT_MARKDOWN;
                $message->fullmessagehtml = $msg;
                $message->smallmessage = "MSG";
                $message->notification = "1";
                $message->courseid = context_system::instance();
                $result = message_send($message);
                if(result !== false && is_numeric($result)){
                    $return['result'] =  true;
                    $return['messageID'] = $result;                                      
                }            
            } catch(Exception $ex){
                $return['debug'] = $ex->getMessage();
            }           
            return $return;
        }

        public static function sendSystemMessage_returns(){
            return new external_single_structure(
                array(
                    'result' => new external_value(PARAM_BOOL, 'Returns if the operation was a success.'),
                    'messageID' => new external_value(PARAM_INT, 'The ID of the message.', VALUE_OPTIONAL),
                    'debug' => new external_value(PARAM_TEXT, 'Returns some debug text.', VALUE_OPTIONAL)                
                )
            );
        }  
        
        public static function sendChatMessage_parameters(){
            return new external_function_parameters(
                array(
                    'message' => new external_value(PARAM_TEXT, 'The message that should be send.')                   
                )
            );
        }

        public static function sendChatMessage($msg){            
            $return = array();
            $return['result'] = false;
            try{                
                global $CFG, $USER;
                require_login(context_system::instance(), false);
                if(empty($msg) || !is_string($msg)) throw new Exception("No valid message.");  
                $BOT = get_complete_user_data("username", "chatbot", $CFG->mnet_localhost_id, false);
                if(!is_object($BOT) || $BOT === false) throw new Exception("Chatbot not found.");             
                $message = new \core\message\message();
                $message->component = 'moodle';
                $message->name = 'instantmessage';
                $message->userfrom = $BOT;
                $message->userto = $USER;                         
                $message->subject = "";            
                $message->fullmessageformat = FORMAT_MARKDOWN;
                $message->fullmessagehtml = "";
                $message->smallmessage = $msg;
                $message->notification = "0";
                $message->courseid = context_system::instance();
                $result = message_send($message);
                if(result !== false && is_numeric($result)){
                    $return['result'] =  true;
                    $return['messageID'] = $result;                                      
                }            
            } catch(Exception $ex){
                $return['debug'] = $ex->getMessage();
            }           
            return $return;
        }

        public static function sendChatMessage_returns(){
            return new external_single_structure(
                array(
                    'result' => new external_value(PARAM_BOOL, 'Returns if the operation was a success.'),
                    'messageID' => new external_value(PARAM_INT, 'The ID of the message.', VALUE_OPTIONAL),
                    'debug' => new external_value(PARAM_TEXT, 'Returns some debug text.', VALUE_OPTIONAL)                
                )
            );
        }  

    
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
            SELECT rc.id, rc.rule_id, rc.source_context_id, rc.lm_key, rc.lm_value, o.title as operator
            FROM {ari_rule_condition} rc
            JOIN {ari_rule_source_context} sc ON rc.source_context_id = sc.id
            JOIN {ari_rule_operator} o ON o.id = rc.operator_id
            ;";
        $query_actions = "
            SELECT 
                ra.id, 
                ra.rule_id, 
                a.title as actor,
                ra.action_title,	
                ra.action_text,
                att.name as action_type,
                ac.name as action_category,	
                ra.course_id,
                tc.title as target_context,	
                ra.dom_content_selector,	
                ra.dom_indicator_selector,	
                ra.viewport_selector,
                t.title as timing,
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
            $condition = [
                "id" => $c->id,
                "context" => $c->source_context_id,
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

    
    

    /////////////////////////////////////////////////////////////////////////////////////////

    public static function get_similar_assessment($param) {
        global $CFG, $DB;
        $query = "
        SELECT DISTINCT
            a2.id,
            aa1.keyword AS search_term,
            a2.instance_id,
        a2.instance_url_id,
            a2.component,
            aa1.document_frequency AS freq1,
            a2.document_frequency AS freq2
        FROM (
            SELECT course_id, keyword, id, document_frequency, instance_url_id
            FROM mthreeeleven_ari_content_model  a1
            WHERE 
            course_id =: course_id AND
            component = :component AND
            instance_id = :instance_id 

            ORDER BY document_frequency DESC
            LIMIT 10
            ) as aa1
        JOIN mthreeeleven_ari_content_model a2 ON a2.keyword = aa1.keyword
        WHERE 
            aa1.id <> a2.id AND
            a2.course_id=aa1.course_id AND
        aa1.instance_url_id <> a2.instance_url_id
        ORDER BY 
            aa1.document_frequency DESC

        ;";
        $records = $DB->get_records_sql($query, array("course_id"=>2, "component"=>'mod_safran', "instance_id"=>412,));   
            echo 'res: ' . count($records) .' instances <br>';
            foreach($records as $record){    
                // echo $record->search_term . ' - freq1=' . $record->freq1 . ' - freq2=' . $record->freq2 .'<br>';
            }
        $result = '';
        return array('data' => json_encode($result));
        
    }



    public static function get_similar_assessment_parameters() {
        return new external_function_parameters(
            array('data' => new external_single_structure(array(
                    'course_id' => new external_value(PARAM_INTEGER, '', VALUE_OPTIONAL),
                    )
                )
            )
        );
    }
    public static function get_similar_assessment_returns() {
        return new external_single_structure(array(
                'data' => new external_value(PARAM_RAW, ''), 
            )
        );
    }
    public static function get_similar_assessment_is_allowed_from_ajax() {
        return true;
    }
    
    
    }





?>