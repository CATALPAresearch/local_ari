<?php

class LearnerModelUniversityData extends LearnerModel{
    
    function build_model(){
        parent::$activity_array['course_enrollments'] = $this->getEnrollmentData();
        // TODO
        // - sozio demografische Angaben
        // - studiengänge
        // - Studienleistungen
        
    }

    function getEnrollmentData(){
        // TODO add further fatures of student enrollment. See EDM'22 Paper.
        // initial data structure
        $arr = [
            "total_enrollments" => 0,
            "total_unique_enrollments" => 0,
            "repeated_courses" => 0,
            "enrolled_courses" => [],
        ];

        // aggregated enrollment information
        $query="
            SELECT
                COUNT(e.id) as total_enrollments,
                COUNT(DISTINCT e.enrolled_course_id) as total_unique_courses,
                (SELECT COUNT(ee.id) FROM {ari_user_enrollments} ee JOIN {user} uu ON uu.id=:user_id2 WHERE uu.id=:user_id3 AND ee.enrollment_repeated <> 'no' ) as repeated_courses
            FROM {ari_user_enrollments} e 
            JOIN {user} u ON u.username=e.username 
            WHERE 
                u.id=:user_id
            ";
        $res = $GLOBALS["DB"]->get_record_sql($query, array('user_id'=>parent::$user_id, 'user_id2'=>parent::$user_id, 'user_id3'=>parent::$user_id));
        // echo '<pre>'.print_r($res, true).'</pre>';
        $arr['total_enrollments'] = (int)$res->total_enrollments;
        $arr['total_unique_enrollments'] = (int)$res->total_unique_courses;
        $arr['repeated_courses'] = (int)$res->repeated_courses;

        // list of enrolled courses
        $query = "
            SELECT 
                DISTINCT e.enrolled_course_id
            FROM {ari_user_enrollments} e 
            JOIN {user} u ON u.username=e.username 
            WHERE 
                u.id=:user_id
        ";
        $res = $GLOBALS["DB"]->get_records_sql($query, array('user_id'=>parent::$user_id));
        foreach($res as $enrollment => $val){
            array_push($arr["enrolled_courses"], $val->enrolled_course_id);
        }

        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';
        return $arr;
    }

    
}