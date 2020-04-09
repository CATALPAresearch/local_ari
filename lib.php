<?php

    /**
     * 
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description Load the JS files.
     * 
    */

    defined('MOODLE_INTERNAL') || exit(0);

    function local_ari_extend_navigation() {
        global $PAGE, $CFG;        
        $PAGE->requires->js_call_amd("local_ari/loader", "init", array($CFG->wwwroot));       
    }    

?>