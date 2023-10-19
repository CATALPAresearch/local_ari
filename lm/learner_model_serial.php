<?php

Class LearnerModelSerial extends LearnerModel {

    function build_model(){
        // return if mod_longpage is not installed
        if(core_plugin_manager::instance()->get_plugins_of_type('format')['serial3']->name != 'serial3'){
            return;
        }

        $this->get_default_entries('format_serial3');

        //$this->get_progress_per_section();
        //parent::$activity_array['mod_hypervideo'] = array_merge(parent::$activity_array['mod_hypervideo'], $this->get_progress_per_section());


    }
    // $records_format_ladtopics_fa_la_access = $GLOBALS["DB"]->get_records_sql($query_activity_ladtopics_access, array(parent::$course_id, parent::$user_id, "format_ladtopics"));
    /*
    $query_activity_ladtopics_access = "
            SELECT 
                other
            FROM {logstore_standard_log}
            WHERE 
                courseid = ? AND
                userid = ? AND
                component = ?
            ";
    // TODO incomplete?
            if ($activityName == "format_ladtopics_activity") {
                $convertComponent = "format_ladtopics";
                //$tmparr = array();
                //$this->recordsActivityFaLa[$activityName] = $GLOBALS["DB"]->get_record_sql($query_activity_fa_la, array($course_id, $user_id, $convertComponent));
                //$this->recordsActivityAccess[$activityName] = $GLOBALS["DB"]->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, $convertComponent));
                //$tmparr = $GLOBALS["DB"]->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, $convertComponent));

                //print_r($this->recordsActivityFaLa[$activityName]);
                //print_r($this->recordsActivityAccess[$activityName]);
            }
    
    */
}
