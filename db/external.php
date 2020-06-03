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
    }

?>