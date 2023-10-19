<?php

/**
 * Collect course activity data for the learner model
 */
class LearnerModelCourse extends LearnerModel{
    
    function build_model(){
        // Assemble results for course-related activities
        $this->get_default_entries('');
        
        parent::$activity_array["course"]["course_overview_page_visits"] = "xxx";
        parent::$activity_array["course"]["goal_changes"] = $this->get_goal_changes();
        parent::$activity_array["course"]["goal_selected"] = "xxx";
        parent::$activity_array["course"]["relative_progress"] = round((( parent::$activity_array['mod_assign']['rel_submissions'] + parent::$activity_array['mod_quiz']['rel_quizes']) / 2) * 100, 1);
        parent::$activity_array["course"]["relative_success"] = round((( parent::$activity_array['mod_assign']['mean_relative_score'] + parent::$activity_array['mod_quiz']['mean_relative_score']) / 2) * 100, 1);
    }


    /**
     * Determine how often a course-related goal has been changed be the user
     */
    function get_goal_changes(){
        $addTimePeriodToQuery = LearnerModel::$addTimePeriodToQuery;
        $query = "
        SELECT
        count(*) as count
        from {logstore_standard_log}
        WHERE 
        userid = ? AND
        courseid = ? AND
        component='format_ladtopics' AND 
        action='change_goal' $addTimePeriodToQuery
        ;
        ";
        $res = $GLOBALS["DB"]->get_record_sql($query, array(parent::$course_id, parent::$user_id));
        return (int)$res->count;
    }

    // TODO
    function get_course_completion(){
        $query_course_sections = "
        SELECT 
            id, sequence, 
            CASE WHEN name IS NULL
            THEN 'NoName'
            ELSE name
        END AS name
        FROM {course_sections}
        WHERE 
            course = ?
        ";
        $query_course_modules_completion = "
            SELECT
                coursemoduleid,
                completionstate
            FROM {course_modules_completion} AS cmc,
                {course_modules} AS cm,
                {modules} AS m
            WHERE  
                cm.course = ? AND
                cmc.userid = ? AND
                cmc.coursemoduleid=cm.id AND
                cm.module=m.id AND
                cmc.completionstate=1 AND
                (m.name='assign' OR
                m.name='quiz' OR
                m.name='safran')
            ORDER BY added ASC
            ";
        $records_course_sections = $GLOBALS["DB"]->get_records_sql($query_course_sections, array(parent::$course_id));
        $records_course_modules_completion = $GLOBALS["DB"]->get_records_sql($query_course_modules_completion, array(parent::$course_id, parent::$user_id));

    }

}