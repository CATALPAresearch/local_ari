<?php

    /**
     * 
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description The config for this plugin.
     * 
    */

    defined('MOODLE_INTERNAL') || exit(0);

    function local_ari_extend_navigation() {
        global $PAGE;        
        $PAGE->requires->js_call_amd("local_ari/loader", "init");       
    }      


?>