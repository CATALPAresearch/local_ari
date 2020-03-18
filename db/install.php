<?php

    /**
     * 
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description Create a chatbot with VIRTUAL ME.
     * 
    */

    defined('MOODLE_INTERNAL') || die();   

    require_once($CFG->dirroot.'/user/lib.php');  

    $BOT = get_complete_user_data("username", "chatbot", $CFG->mnet_localhost_id, false);
    if($BOT === false){
        $BOT = create_user_record("chatbot", md5(uniqid(rand(), true)));
    }       

    /**
     * The Data you can use to give the chatbot a VIRTUAL ME.
     */

    $BOT->firstname = "Course";
    $BOT->lastname = "Chatbot";
    $BOT->email = "noreply@fernuni-hagen.de";
    $BOT->lang = "en";
    $BOT->auth = "nologin";
    $BOT->city = "Hagen";
    $BOT->country = "DE";
    $BOT->timezone = "Europe/Berlin";
    $BOT->calendartype = "gregorian";
    $BOT->description = "It's a chatbot.";
    $BOT->lang = "de";

    //$BOT->picture = ""

    // Do not edit after here.

    $BOT->firstname = ucfirst(strtolower($BOT->firstname));
    $BOT->lastname = ucfirst(strtolower($BOT->lastname));

    user_update_user($BOT, false, false);

    function xmldb_local_ari_install() {
        global $CFG;    
    }    

?>
    
    

   