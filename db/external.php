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