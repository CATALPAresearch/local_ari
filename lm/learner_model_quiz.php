<?php 

/**
     * Testfälle:
     * - keine items in section
     * - keine items im kurs
     * - kein item im kurs bearbeitet
     * - kein item in section bearbeitet
     * - item verborgen
     * - section verborgen
     * - item mehrfach submitted
     * - mehrere items einer section bearbeitet
     * - mehrere items mehrerer sections bearbeitet
     * 
     * TODO
     * - "count_attempts_per_quiz" => $blank,
     * - "avg_attempt_time_per_task" => $blank,
     * - "reattempt_delay" => $blank,
     * - verhältnis von bearbeitetet und nur betrachtetetn quizzes
     */
class LearnerModelQuiz extends LearnerModel {

    function build_model(){
        
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['quiz']->name != 'quiz'){
            return;
        }
        $this->get_default_entries('mod_quiz');
        parent::$activity_array['mod_quiz'] = array_merge(parent::$activity_array['mod_quiz'], $this->get_progress_per_section());
        
    }

    function get_progress_per_section(){
        $query = "SELECT
                    qsub.id,
                    q.id activity_id,
                    m.name activity,
                    cm.id module_id,
                    cm.section,
                    cs.name as section_title,
                    (select count(*) from {course_modules} cmm JOIN {modules} m ON m.id = cmm.module WHERE m.name = 'quiz' AND cmm.course=cm.course AND cmm.section = cm.section AND cmm.visible = 1 AND cm.visible = 1) number_of_quizes,
                    q.grade max_score, 
                    qsub.sumgrades achieved_score,
                    qsub.timemodified  submission_time,
                    qsub.timemodified grading_time,
                    (SELECT count(l.id) FROM {logstore_standard_log} l WHERE l.contextinstanceid = cm.id AND cm.visibleoncoursepage = 1 AND l.component = 'mod_quiz' AND l.courseid = q.course AND l.userid = qsub.userid AND l.eventname LIKE '%attempt_reviewed') as number_of_attempts
                FROM {quiz} q
                LEFT JOIN {quiz_attempts} qsub ON q.id = qsub.quiz
                LEFT JOIN {course_modules} cm ON q.id = cm.instance
                LEFT JOIN {modules} m ON m.id = cm.module 
                LEFT JOIN {course_sections} cs ON cm.section = cs.id
                WHERE 
                    q.course = :course_id AND 
                    qsub.userid = :user_id AND
                    qsub.state = 'finished' AND
                    m.name = 'quiz' AND
                    cm.visibleoncoursepage = 1 AND
                    m.visible = 1 AND
                    cs.visible = 1 AND
                    qsub.timemodified >= :period_start AND
                    qsub.timemodified < :period_end
                ORDER BY qsub.timemodified
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
            } 
            $arr["total_performed_unique_quizes"]++;
            if($item->number_of_attempts > 1){
                $arr["total_repeated_unique_quizes"]++;
            }
            $arr["total_attempts"] += $item->number_of_attempts;
            $arr["achieved_scores"] += $item->achieved_score;
            $arr["max_scores"] += $item->max_score;
            $arr["rel_submissions"] = $item->number_of_quizes > 0 ? $arr["total_submissions"] / $item->number_of_quizes : 0;
            
            $arr["sections"]["section-" . $item->section] = [
                "title" => $item->section_title,
                "first_attempt" => 0,
                "total_attempts" => 0,
                "total_performed_unique_quizes" => 0,
                "total_repeated_unique_quizes" => 0,
                "total_existing_unique_quizes" => 0,
                "rel_quizes" => 0,
                "achieved_scores" => 0,
                "max_scores" => 0,
                "mean_relative_score" => 0,
            ];
            $arr["sections"]["section-" . $item->section]["title"] = $item->section_title;
            $arr["sections"]["section-" . $item->section]["total_existing_unique_quizes"] = $item->number_of_quizes;
            
            if($arr["sections"]["section-" . $item->section]["first_attempt"] == 0){
                $arr["sections"]["section-" . $item->section]["first_attempt"] = $item->submission_time;
            }
            $arr["sections"]["section-" . $item->section]["total_performed_unique_quizes"]++;
            $arr["sections"]["section-" . $item->section]["rel_quizes"] = $arr["sections"]["section-" . $item->section]["total_existing_unique_quizes"] > 0 ? $arr["sections"]["section-" . $item->section]["total_performed_unique_quizes"] / $arr["sections"]["section-" . $item->section]["total_existing_unique_quizes"] : 0;
            $arr["sections"]["section-" . $item->section]["achieved_scores"] += $item->achieved_score;
            $arr["sections"]["section-" . $item->section]["max_scores"] += $item->max_score;
            $arr["sections"]["section-" . $item->section]["total_attempts"] += $item->number_of_attempts;
            if($item->number_of_attempts > 1){
                $arr["sections"]["section-" . $item->section]["total_repeated_unique_quizes"]++;
            }
            if($arr["sections"]["section-" . $item->section]["first_attempt"] == 0){
                $arr["sections"]["section-" . $item->section]["first_attempt"] = $item->submission_time;
            }
        }
        //$total_number_of_quizzes = 10;
        if($arr["max_scores"] > 0){
            $sum_items = 0;
            $arr["mean_relative_score"] = $arr["max_scores"] > 0 ? $arr["achieved_scores"] / $arr["max_scores"] : 0;
            foreach($arr["sections"] as $key => $section){
                $sum_items += $arr["sections"][$key]["total_existing_unique_quizes"];
                $arr["sections"][$key]["mean_relative_score"] = $section["max_scores"] > 0 ? $section["achieved_scores"] / $section["max_scores"] : 0;
            }
            $arr["rel_quizes"] = $sum_items > 0 ? $arr["total_performed_unique_quizes"] / $sum_items : 0;
            $arr["total_existing_unique_quizes"] = $sum_items;
        }

        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';

        return $arr;
    }
}