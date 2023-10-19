<?php

class LearnerModelLongpage extends LearnerModel{
    
    
    function build_model(){
        // return if mod_longpage is not installed
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['longpage']->name != 'longpage'){
            return;
        }
        $this->get_default_entries('mod_longpage');
         
        [
            $longpage_instances_data, 
            $countMarks, 
            $countBookmarks, 
            $countPublicComments, 
            $countPrivateComments, 
            $ratioReadText,
            $countSections,
            ] = $this->get_longpage_data();
            
            parent::$activity_array["mod_longpage"]["count_marks"] = $countMarks;
            parent::$activity_array["mod_longpage"]["count_bookmarks"] = $countBookmarks;
            parent::$activity_array["mod_longpage"]["count_public_comments"] = $countPublicComments;
            parent::$activity_array["mod_longpage"]["count_private_comments"] = $countPrivateComments;
            parent::$activity_array["mod_longpage"]["count_opened_quizzes"] = "xxx";
            parent::$activity_array["mod_longpage"]["number_of_sections"] = $countSections;
            parent::$activity_array["mod_longpage"]["ratio_read_text"] = $ratioReadText;
            parent::$activity_array["mod_longpage"]["instances"] = $longpage_instances_data;
            
    }

    function xxx(){
        $query = "SELECT DISTINCT 
                m.name activity,
                l.id activity_id,
                cm.id module_id,
                cm.section,
                COUNT(DISTINCT lrp.section) complete,
                AVG(lrp.sectioncount) count,
                '0' AS max_score,
                '0' AS achieved_score,
                MAX(lrp.timemodified) AS submission_time,
                '0' AS grading_time
                FROM {longpage} l
                JOIN {longpage_reading_progress} lrp ON l.id = lrp.longpageid
                RIGHT JOIN {course_modules} cm ON l.id = cm.instance
                RIGHT JOIN {modules} m ON m.id = cm.module 
                WHERE 
                l.course = :courseid AND
                lrp.userid= :userid AND 
                m.name = 'longpage'
                Group by m.name, l.id, cm.id, cm.section 
        ";
    }

    
    /**
     * 
     */
    function get_longpage_data(){
        $addTimePeriodToQuery = LearnerModel::$addTimePeriodToQuery;
        // comments are saved in this table
        // 0 = marked text, 1 = annotation, 2 = bookmarks
        $query_longpage_posts = "
        SELECT SUM(lp.ispublic) AS sum, COUNT(lp.id) AS count
        FROM {longpage_posts} lp
        JOIN {longpage} l ON lp.longpageid = l.id
        WHERE l.course = :course_id AND lp.creatorid = :user_id $addTimePeriodToQuery
        ;";

        $query_longpage_post_reading = "
        SELECT COUNT(lpr.id) AS count
        FROM {longpage_post_readings} lpr
        JOIN {longpage} l ON lpr.postid = l.id
        WHERE l.course = :course_id AND lpr.userid = :user_id $addTimePeriodToQuery
        ;";

        // $addTimePeriodToQuery
        $query_longpage_annotations = "
        SELECT la.id, type, ispublic, longpageid
        FROM {longpage_annotations} la 
        JOIN {longpage} l ON la.longpageid = l.id
        WHERE l.course = :course_id AND la.creatorid = :user_id
        ;";

        // TODO: add self::$addTimePeriodToQuery
        $query_longpage_instances = "
        SELECT id, name
        FROM {longpage}
        WHERE course = :course_id 
        ;";

        // TODO: add self::$addTimePeriodToQuery
        $query_longpage_reading_progress = "
        SELECT COUNT(DISTINCT section) AS count, sectioncount AS number_of_sections, longpageid
        FROM {longpage_reading_progress}
        WHERE course = :course_id AND userid = :user_id 
        GROUP BY longpageid, sectioncount
        ;";

        try{
            if ($GLOBALS["DB"]->count_records("longpage") > 0) {
                // TODO: post creation
                //$records_longpage_posts = $GLOBALS["DB"]->get_records_sql($query_longpage_posts, array('course_id'=>$course_id, 'user_id'=>$user_id));
                // TODO: post reading
                //$records_longpage_post_readings = $GLOBALS["DB"]->get_records_sql($query_longpage_post_readings, array('course_id' => $course_id, 'user_id' => $user_id));
                $records_longpage_annotations = $GLOBALS["DB"]->get_records_sql($query_longpage_annotations, array('course_id'=>parent::$course_id, 'user_id'=>parent::$user_id));
                $records_longpage_reading_progress = $GLOBALS["DB"]->get_records_sql($query_longpage_reading_progress, array('course_id'=>parent::$course_id, 'user_id'=>parent::$user_id));
                $records_longpage_instances = $GLOBALS["DB"]->get_records_sql($query_longpage_instances, array('course_id' => parent::$course_id));
            }
        } catch (Exception $e) {
            parent::debug("DB error" . print_r($e) . "LINE " . __LINE__);
            
        }

        $countMarks = 0;
        $countBookmarks = 0;
        $countPublicComments = 0;
        $countPrivateComments = 0;
        $countSections = 0;
        $ratioReadText = 0;

        $tmparr = array();

        //initiate array members for easier counting
        foreach ($records_longpage_instances as $singleRecord) {
            $tmparr[$singleRecord->id]["marks"] = 0;
            $tmparr[$singleRecord->id]["bookmarks"] = 0;
            $tmparr[$singleRecord->id]["publicComments"] = 0;
            $tmparr[$singleRecord->id]["privateComments"] = 0;

            $tmparr[$singleRecord->id]["title"] = "none";
            $tmparr[$singleRecord->id]["count_sections"] = 0;
            $tmparr[$singleRecord->id]["number_of_sections"] = 0;
        }

        foreach ($records_longpage_annotations as $singleRecord) {
            switch($singleRecord->type){
                case 0:
                    $tmparr[$singleRecord->longpageid]["marks"] += 1;
                    break;
                case 1:
                    if ($singleRecord->ispublic == 1){
                        $tmparr[$singleRecord->longpageid]["publicComments"] += 1;
                    } else if ($singleRecord->ispublic == 0){ 
                        $tmparr[$singleRecord->longpageid]["privateComments"] += 1;
                    }
                    break;
                case 2:
                    $tmparr[$singleRecord->longpageid]["bookmarks"] += 1;
            }
        }

        foreach ($records_longpage_instances as $singleRecord) {
            $tmparr[$singleRecord->id]["title"] = $singleRecord->name;
        }

        foreach ($records_longpage_reading_progress as $singleRecord) {
            $tmparr[$singleRecord->longpageid]["count_sections"] = (int)$singleRecord->count;
            $tmparr[$singleRecord->longpageid]["number_of_sections"] = (int)$singleRecord->number_of_sections;
        }
    
        foreach($tmparr as $singleRecord){
            $countMarks += $singleRecord["marks"];
            $countBookmarks += $singleRecord["bookmarks"];
            $countPublicComments += $singleRecord["publicComments"];
            $countPrivateComments += $singleRecord["privateComments"];
            $countSections += $singleRecord["number_of_sections"];
            if ($singleRecord["count_sections"] != 0) {
                $ratioReadText = $singleRecord["count_sections"] / $singleRecord["number_of_sections"];
            }
        }
        
        return [$tmparr, $countMarks, $countBookmarks, $countPublicComments, $countPrivateComments, $ratioReadText, $countSections];
    }
}
