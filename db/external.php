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

    require_once($CFG->dirroot.'/user/lib.php');  
    require_once($CFG->libdir . "/externallib.php");

    class local_ari_external extends external_api {
        
        // Send a system message
        public static function sendSystemMessage_parameters(){
            return new external_function_parameters(
                array(
                    'message' => new external_value(PARAM_TEXT, 'The message that should be send.')                    
                )
            );
        }
        
        public static function sendSystemMessage($message){
            $return = array("result" => false); 
            try{ 
                $return['result'] = true;
                $return['messageID'] = 1;
            } catch(Exception $ex){       
                $return['result'] = false;  
                $return['messageID'] = 0;               
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

        // Send a chat message
        public static function sendChatMessage_parameters(){
            return new external_function_parameters(
                array(
                    'message' => new external_value(PARAM_TEXT, 'The message that should be send.')                    
                )
            );
        }

        public static function sendChatMessage($message){
            $return = array("result" => false); 
            try{ 
                $return['result'] = true;
                $return['messageID'] = 1;
            } catch(Exception $ex){       
                $return['result'] = false;  
                $return['messageID'] = 0;             
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