<?php

    /**
     * 
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description Delete the chatbot.
     * 
    */

    defined('MOODLE_INTERNAL') || die();   

    require_once($CFG->dirroot.'/user/lib.php');
    $BOT = get_complete_user_data("username", "chatbot", $CFG->mnet_localhost_id, false);
    if($BOT !== false && is_object($BOT) && !is_null($BOT)) delete_user($entry);
    
?>