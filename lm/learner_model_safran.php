<?php

/**
 * TODO:
 * 
 */
class LearnerModelSafran extends LearnerModel {

    function build_model(){
        
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['safran']->name != 'safran'){
            return;
        }
        $this->get_default_entries('mod_safran');
        parent::$activity_array['mod_safran'] = array_merge(parent::$activity_array['mod_safran'], $this->get_progress_per_section());
        
    }

    function get_progress_per_section(){
        $query = "SELECT
        cm.id AS module_id,  
        question.id AS question_id,
        question.safranid,
        cm.section as section,
        cs.name as section_title,
        question.question_title,
        
        (SELECT SUM(sa.achived_points_percentage) FROM {safran_q_attempt} sa WHERE sa.status='request_feedback') as rel_scores,
        (SELECT count(sa.id) FROM {safran_q_attempt} sa WHERE sa.status='open_task_from_list' AND sa.questionid = question.id) as views,
        (SELECT count(sa.id) FROM {safran_q_attempt} sa WHERE sa.status='repeat_same_task' AND sa.questionid = question.id) as repeat_same,
        (SELECT count(sa.id) FROM {safran_q_attempt} sa WHERE sa.status='request_feedback' AND sa.questionid = question.id) as attempts,
        
        (SELECT count(sa.id) FROM {safran_q_attempt} sa WHERE sa.status='request_feedback' AND sa.questionid = question.id) as max_score,
        (SELECT SUM(sa.achived_points_percentage) FROM {safran_q_attempt} sa WHERE sa.status='request_feedback') as achieved_scores,
        
        -- (SELECT count(cmm.id) from mthreeeleven_course_modules cmm JOIN mthreeeleven_modules m ON m.id = cmm.module WHERE m.name = 'safran' AND cmm.course=cm.course AND cmm.section = cm.section AND cmm.visible = 1 AND cm.visible = 1) number_of_quizes,
        (SELECT COUNT(id) FROM  {safran_question} WHERE safranid=safran.id) AS number_of_tasks,
        (SELECT sa.timecreated FROM {safran_q_attempt} sa WHERE sa.questionid = question.id ORDER BY sa.timecreated LIMIT 1) AS first_attempt, 
        question.id
        
        FROM {safran} safran
        LEFT JOIN {safran_question} question ON question.safranid = safran.id
        LEFT JOIN {safran_q_attempt} qa ON question.id = qa.questionid
        LEFT JOIN {course_modules} cm ON safran.id = cm.instance
        LEFT JOIN {modules} m ON m.id = cm.module 
        LEFT JOIN {course_sections} cs ON cm.section = cs.id
        
        WHERE
            question.id IS NOT NULL AND
            safran.course = :course_id AND 
            qa.userid = :user_id AND
            m.name = 'safran' AND
            cm.visibleoncoursepage = 1 AND
            m.visible = 1 AND
            cs.visible = 1 AND
            qa.timecreated > :period_start AND
            qa.timecreated < :period_end
        GROUP BY cm.id, question.id, cs.name, safran.id -- xxx test this!
        -- ORDER BY qa.timecreated
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
            "total_performed_unique_tasks" => 0,
            "total_repeated_unique_tasks" => 0,
            "total_existing_unique_tasks" => 0,
            "achieved_scores" => 0,
            "max_scores" => 0,
            "mean_relative_score" => 0,
            "rel_performed_tasks" => 0,
            "sections" => [],
        ];
        foreach($res as $key => $item){
            
            if($arr["first_attempt"] == 0){
                $arr["first_attempt"] = $item->first_attempt;
            } 
            $arr["total_attempts"] += $item->attempts;
            $arr["total_performed_unique_tasks"]++;
            if($item->attempts > 1){
                $arr["total_repeated_unique_tasks"]++;
            }
            $arr["total_existing_unique_tasks"] += $item->number_of_tasks;
            $arr["achieved_scores"] += $item->achieved_scores;
            $arr["max_scores"] += $item->max_score;

            // per section
            if(isset($arr["sections"]["section-" . $item->section]) == false){
                $arr["sections"]["section-" . $item->section] = [
                    "title" => $item->section_title,
                    "first_attempt" => $item->first_attempt,
                    "total_attempts" => 0,
                    "total_performed_unique_tasks" => 0,
                    "total_repeated_unique_tasks" => 0,
                    "total_existing_unique_tasks" => 0,
                    "achieved_scores" => 0,
                    "max_scores" => 0,
                    "mean_relative_score" => 0,
                    "rel_performed_tasks" => 0,
                ];
            }
            $arr["sections"]["section-" . $item->section]["first_attempt"] = $item->first_attempt;
            $arr["sections"]["section-" . $item->section]["total_attempts"] += $item->attempts;
            $arr["sections"]["section-" . $item->section]["total_performed_unique_tasks"]++;
            if($item->attempts > 1){
                $arr["sections"]["section-" . $item->section]["total_repeated_unique_tasks"]++;
            }
            $arr["sections"]["section-" . $item->section]["total_existing_unique_tasks"] += $item->number_of_tasks;
            $arr["sections"]["section-" . $item->section]["achieved_scores"] += $item->achieved_scores;
            $arr["sections"]["section-" . $item->section]["max_scores"] += $item->max_score;
            $arr["sections"]["section-" . $item->section]["mean_relative_score"] = $item->achieved_scores;
        }
        
        $sum_items = 0;
        if($arr["max_scores"]>0){
            $arr["mean_relative_score"] = $arr["max_scores"] > 0 ? $arr["achieved_scores"] / $arr["max_scores"] : 0;
        }
        foreach($arr["sections"] as $key => $section){
            $sum_items += $arr["sections"][$key]["total_existing_unique_tasks"];
            if($section["max_scores"]>0){
                $arr["sections"][$key]["mean_relative_score"] = $arr["max_scores"] > 0 ? $section["achieved_scores"] / $section["max_scores"] : 0;
            }
            $arr["sections"][$key]["rel_performed_tasks"] = $arr["sections"][$key]["total_performed_unique_tasks"] / $arr["sections"][$key]["total_existing_unique_tasks"];
        }
        $arr["rel_performed_tasks"] = $sum_items > 0 ? $arr["total_performed_unique_tasks"] / $sum_items : 0;
        $arr["total_existing_unique_tasks"] = $sum_items;
    
    
        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';

        return $arr;
    }

}



/*

SELECT
cm.id AS module_id,  
question.id AS question_id,
question.safranid,
cm.section as section,
cs.name as section_title,
question.question_title,

(SELECT SUM(sa.achived_points_percentage) FROM mthreeeleven_safran_q_attempt sa WHERE sa.status='request_feedback') as rel_scores,
(SELECT count(sa.id) FROM mthreeeleven_safran_q_attempt sa WHERE sa.status='open_task_from_list' AND sa.questionid = question.id) as views,
(SELECT count(sa.id) FROM mthreeeleven_safran_q_attempt sa WHERE sa.status='repeat_same_task' AND sa.questionid = question.id) as repeat_same,
(SELECT count(sa.id) FROM mthreeeleven_safran_q_attempt sa WHERE sa.status='request_feedback' AND sa.questionid = question.id) as attempts,

(SELECT count(sa.id) FROM mthreeeleven_safran_q_attempt sa WHERE sa.status='request_feedback' AND sa.questionid = question.id) as max_score,
(SELECT SUM(sa.achived_points_percentage) FROM mthreeeleven_safran_q_attempt sa WHERE sa.status='request_feedback') as achieved_score,

-- (SELECT count(cmm.id) from mthreeeleven_course_modules cmm JOIN mthreeeleven_modules m ON m.id = cmm.module WHERE m.name = 'safran' AND cmm.course=cm.course AND cmm.section = cm.section AND cmm.visible = 1 AND cm.visible = 1) number_of_quizes,
(SELECT COUNT(id) FROM  mthreeeleven_safran_question WHERE safranid=safran.id) AS number_of_quizes,
(SELECT sa.timecreated FROM mthreeeleven_safran_q_attempt sa WHERE sa.questionid = question.id ORDER BY sa.timecreated LIMIT 1) AS first_attempt, 
question.id

FROM mthreeeleven_safran safran
LEFT JOIN mthreeeleven_safran_question question ON question.safranid = safran.id
LEFT JOIN mthreeeleven_safran_q_attempt qa ON question.id = qa.questionid
LEFT JOIN mthreeeleven_course_modules cm ON safran.id = cm.instance
LEFT JOIN mthreeeleven_modules m ON m.id = cm.module 
LEFT JOIN mthreeeleven_course_sections cs ON cm.section = cs.id

WHERE 

question.id IS NOT NULL AND
    safran.course = 2 AND 
    qa.userid = 2 AND
    m.name = 'safran' AND
    cm.visibleoncoursepage = 1 AND
    m.visible = 1 AND
    cs.visible = 1 -- AND
--                    qa.timecreated > :period_start AND
--                  qa.timecreated < :period_end
GROUP BY cm.id, question.id
-- ORDER BY qa.timecreated

    */