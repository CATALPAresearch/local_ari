<?php 

class LearnerModelAssignment extends LearnerModel {
    
    function build_model(){    
        // return if mod_longpage is not installed
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['assign']->name != 'assign'){
            return;
        }
        $this->get_default_entries('mod_assign');
        parent::$activity_array['mod_assign'] = array_merge(parent::$activity_array['mod_assign'], $this->get_progress_per_section());
    }

    function get_progress_per_section(){
        $query = "  SELECT
                        asub.id,
                        a.id activity_id,
                        m.name activity,
                        cm.id module_id,
                        cm.section, 
                        cs.name as section_title,
                        (SELECT count(*) FROM {course_modules} cmm JOIN {modules} m ON m.id = cmm.module WHERE m.name = 'assign' AND cmm.course = cm.course AND cmm.section = cm.section AND cmm.visible = 1 AND cm.visible = 1) number_of_assignments,
                        a.grade max_score, 
                        ag.grade achieved_score,
                        asub.timemodified  submission_time,
                        ag.timemodified grading_time
                    FROM {assign} a
                    LEFT JOIN {assign_grades} ag ON a.id = ag.assignment
                    LEFT JOIN {assign_submission} asub ON a.id = asub.assignment
                    LEFT JOIN {course_modules} cm ON a.id = cm.instance
                    LEFT JOIN {modules} m ON m.id = cm.module 
                    LEFT JOIN {course_sections} cs ON cm.section = cs.id
                    WHERE
                        a.course = :course_id AND 
                        ag.userid = :user_id AND 
                        asub.status = 'submitted' AND 
                        asub.latest = 1 AND 
                        m.name = 'assign' AND
                        cm.visibleoncoursepage = 1 AND
                        m.visible = 1 AND
                        cs.visible = 1 AND
                        asub.timemodified >= :period_start AND
                        asub.timemodified < :period_end
                    ORDER BY asub.timemodified 
                    ;";
        
        $res = $GLOBALS["DB"]->get_records_sql($query, array(
            "course_id" => parent::$course_id, 
            "user_id" => parent::$user_id,
            "period_start" => $this->time_period_start,
            "period_end" => $this->time_period_end,
        ));
        
        $arr = [
            "first_submission" => 0,
            "total_submissions" => 0,
            "rel_submissions" => 0,
            "achieved_scores" => 0,
            "max_scores" => 0,
            "mean_relative_score" => 0,
            "sections" => [],
        ];
        foreach($res as $key => $item){
            
            if($arr["first_submission"] == 0){
                $arr["first_submission"] = (int)$item->submission_time;
            } 
            $arr["total_submissions"]++;

            $arr["rel_submissions"] = $item->number_of_assignments > 0 ? $arr["total_submissions"] / $item->number_of_assignments : 0; 
            $arr["achieved_scores"] += $item->achieved_score;
            $arr["max_scores"] += $item->max_score;
            
            // per section
           
            $arr["sections"]["section-" . $item->section] = [
                "title" => $item->section_title,
                "first_submission" => 0,
                "total_submissions" => 0,
                "rel_submissions" => 0,
                "achieved_scores" => 0,
                "max_scores" => 0,
                "mean_relative_score" => 0,
            ];
        
            if($arr["sections"]["section-" . $item->section]["first_submission"] == 0){
                $arr["sections"]["section-" . $item->section]["first_submission"] = (int)$item->submission_time;
            }
            $arr["sections"]["section-" . $item->section]["total_submissions"]++;
            $arr["sections"]["section-" . $item->section]["rel_submissions"] = $item->number_of_assignments > 0 ? $arr["total_submissions"] / $item->number_of_assignments : 0;
            $arr["sections"]["section-" . $item->section]["achieved_scores"] += $item->achieved_score;
            $arr["sections"]["section-" . $item->section]["max_scores"] += $item->max_score;
            
        }
        if($arr["max_scores"] > 0){
            $arr["mean_relative_score"] = $arr["max_scores"] > 0 ? $arr["achieved_scores"] / $arr["max_scores"] : 0;
            foreach($arr["sections"] as $key => $section){
                $arr["sections"][$key]["mean_relative_score"] = $section["max_scores"] > 0 ? $section["achieved_scores"] / $section["max_scores"] : 0;
            }
        }
        
        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';
        
        return $arr;
    }
}