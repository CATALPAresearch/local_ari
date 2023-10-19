<?php

/**
 * TODO:
 * - total_existing_unique_quizes
 */
class LearnerModelSafran extends LearnerModel {

    function build_model(){
        
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['safran']->name != 'safran'){
            return;
        }
        $this->get_default_entries('mod_safran');
        //parent::$activity_array['mod_safran'] = array_merge(parent::$activity_array['mod_safran'], $this->get_progress_per_section());
        //$this->get_progress_per_section();
        
    }

    function get_progress_per_section(){
        $query = "SELECT
                    qa.id,
                    qa.status,
                    qa.user_error_situation,
                    (SELECT SUM(sa.achived_points_percentage) FROM {safran_q_attempt} sa WHERE sa.status='request_feedback' AND sa.questionid=qa.questionid)  as rel_scores,
                    qa.attempt,
                    q.id activity_id,
                    m.name activity,
                    cm.id module_id,
                    cm.section,
                    cs.name as section_title,
                    (select count(*) from {course_modules} cmm JOIN {modules} m ON m.id = cmm.module WHERE m.name = 'safran' AND cmm.course=cm.course AND cmm.section = cm.section AND cmm.visible = 1 AND cm.visible = 1) number_of_quizes,
                    -- q.grade, 
                    -- max_score, 
                    -- qa.sumgrades achieved_score,
                    qa.timecreated  submission_time,
                    count(qa.id) as number_of_attempts
                FROM {safran} q
                LEFT JOIN {safran_q_attempt} qa ON q.id = qa.questionid
                LEFT JOIN {course_modules} cm ON q.id = cm.instance
                LEFT JOIN {modules} m ON m.id = cm.module 
                LEFT JOIN {course_sections} cs ON cm.section = cs.id
                
                WHERE 
                    q.course = :course_id AND 
                    qa.userid = :user_id AND
                    m.name = 'safran' AND
                    cm.visibleoncoursepage = 1 AND
                    m.visible = 1 AND
                    cs.visible = 1 AND
                    qa.timecreated > :period_start AND
                    qa.timecreated < :period_end
                GROUP BY q.id
                ORDER BY qa.timecreated
        
        ";

        $res = $GLOBALS["DB"]->get_records_sql($query, array(
            "course_id" => parent::$course_id, 
            "user_id" => parent::$user_id,
            "period_start" => $this->time_period_start,
            "period_end" => $this->time_period_end,
        ));

        $arr = [
            "first_attempt" => 0,
            "total_attempts" => 0,
            "total_performed_unique_quizes" => 0,
            "total_repeated_unique_quizes" => 0,
            "total_existing_unique_quizes" => 0,
            "rel_quizes" => 0,
            "achieved_scores" => 0,
            "max_scores" => 0,
            "mean_relative_score" => 0,
            "sections" => [],
        ];
        foreach($res as $key => $item){
            
            if($arr["first_attempt"] == 0){
                $arr["first_attempt"] = $item->submission_time;
            } else if($arr["first_attempt"] > $item->submission_time){
                $arr["first_attempt"] = $item->submission_time;
            }
            $arr["total_performed_unique_quizes"]++;
            if($item->number_of_attempts > 1){
                $arr["total_repeated_unique_quizes"]++;
            }
            $arr["total_attempts"] += $item->number_of_attempts;
            $arr["achieved_scores"] += $item->rel_scores;
            $arr["max_scores"] += $item->max_score;
            
            // per section
            if($arr["sections"]["section-" . $item->section] == null){
                $arr["sections"]["section-" . $item->section] = [
                    "title" => $item->section_title,
                    "first_submission" => $item->submission_time,
                    "total_performed_unique_quizes" => 0,
                    "total_existing_unique_quizes" => $item->number_of_quizes,
                    "rel_submissions" => 0,
                    "max_scores" => 0,
                    "achieved_scores" => 0,
                    "mean_relative_score" => 0,
                ];
            }
            if($arr["sections"]["section" . $item->section]["first_attempt"] > $item->submission_time){
                $arr["sections"]["section" . $item->section]["first_attempt"] = $item->submission_time;
            }
            $arr["sections"]["section-" . $item->section]["total_performed_unique_quizes"]++;
            //$arr["sections"]["section-" . $item->section]["rel_submissions"] = $arr["sections"]["section-" . $item->section]["total_submissions"] / $item->number_of_quizes;
            $arr["sections"]["section-" . $item->section]["achieved_scores"] += $item->achieved_score;
            $arr["sections"]["section-" . $item->section]["max_scores"] += $item->max_score;
            
        }
        $total_number_of_quizzes = 10;
        
        $sum_items = 0;
        if($arr["max_scores"]>0){
            $arr["mean_relative_score"] = $arr["achieved_scores"] / $arr["max_scores"];
        }
        foreach($arr["sections"] as $key => $section){
            $sum_items += $arr["sections"][$key]["total_existing_unique_quizes"];
            if($section["max_scores"]>0){
                $arr["sections"][$key]["mean_relative_score"] = $section["achieved_scores"] / $section["max_scores"];
            }
        }
        $arr["rel_quizes"] = $arr["total_performed_unique_quizes"] / $sum_items;
        $arr["total_existing_unique_quizes"] = $sum_items;
    
    
        

        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';

        //return $arr;
    }

}