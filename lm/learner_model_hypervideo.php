<?php


class LearnerModelHypervideo extends LearnerModel {

    function build_model(){
        
        // return if mod_longpage is not installed
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['hypervideo']->name != 'hypervideo'){
            return;
        }

        $this->get_default_entries('mod_hypervideo');

        //$this->get_progress_per_section();
        parent::$activity_array['mod_hypervideo'] = array_merge(parent::$activity_array['mod_hypervideo'], $this->get_progress_per_section());

    }

    function get_progress_per_section(){
        $query = "SELECT DISTINCT 
                    hl.hypervideo,
                    h.name,
                    -- h.id activity_id,
                    -- m.name activity,
                    -- hl.actions,
                    -- hl.val,
                    (SELECT SUM(val) * 2 FROM {hypervideo_log} WHERE actions='playback' AND hypervideo=hl.hypervideo) as total_playback_time,
                    (SELECT SUM(val) * 2 / duration FROM {hypervideo_log} WHERE actions='playback' AND hypervideo=hl.hypervideo) as relative_playback_time,
                    hl.duration as duration,
                    (SELECT COUNT(id) FROM {hypervideo_log} WHERE actions='pause' AND hypervideo=hl.hypervideo) as total_pause_events,
                    (SELECT COUNT(id) FROM {hypervideo_log} WHERE actions='pause' AND hypervideo=hl.hypervideo) as total_play_events,
                    (SELECT COUNT(id) FROM {hypervideo_log} WHERE actions='seeked' AND hypervideo=hl.hypervideo) as total_seeked_events,
                    (SELECT COUNT(id) FROM {hypervideo_log} WHERE actions='ended' AND hypervideo=hl.hypervideo) as total_ended_events,
                    (SELECT MIN(o.occurances) FROM (
                        SELECT val, COUNT(*) as occurances FROM {hypervideo_log} WHERE actions='playback' AND hypervideo=hl.hypervideo GROUP BY val 
                        ) as o) as complete_playbacks,
                    (MAX(hl.timemodified) - MIN(hl.timemodified)) / 1000 / 60 as time_spent,
                    hl.timemodified as submission_time,
                    cm.id module_id,
                    cm.section,
                    cs.name as section_title
                FROM {hypervideo} h
                JOIN {hypervideo_log} hl ON h.id = hl.hypervideo
                RIGHT JOIN {course_modules} cm ON h.id = cm.instance
                RIGHT JOIN {modules} m ON m.id = cm.module 
                LEFT JOIN {course_sections} cs ON cm.section = cs.id
                WHERE 
                    h.course = :course_id AND
                    hl.userid = :user_id AND 
                    m.name = 'hypervideo' AND
                    cm.visibleoncoursepage = 1 AND
                    m.visible = 1 AND
                    -- hl.actions = 'playback' AND
                    hl.timemodified > :period_start * 1000 AND
                    hl.timemodified < :period_end * 1000
                GROUP BY hl.hypervideo
                -- ORDER BY qsub.timemodified
            ;";

        $res = $GLOBALS["DB"]->get_records_sql($query, array(
            "course_id" => parent::$course_id, 
            "user_id" => parent::$user_id,
            "period_start" => $this->time_period_start,
            "period_end" => $this->time_period_end,
        ));

        $arr = [
            "count_videos" => 0,
            "total_playback_time" => 0,
            "relative_playback_time" => 0,
            "duration" => 0,
            "total_pause_events" => 0,
            "total_play_events" => 0,
            "total_seeked_events" => 0,
            "total_ended_events" => 0,
            "complete_playbacks" => 0,
            "time_spent" => 0,
            "sections" => [],
        ];
        foreach($res as $key => $item){
            $arr["count_videos"]++;
            $arr["total_playback_time"] += $item->total_playback_time;
            $arr["relative_playback_time"] += $item->relative_playback_time;
            $arr["duration"] += $item->duration;
            $arr["total_pause_events"] += $item->total_pause_events;
            $arr["total_play_events"] += $item->total_play_events;
            $arr["total_seeked_events"] += $item->total_seeked_events;
            $arr["total_ended_events"] += $item->total_ended_events;
            $arr["complete_playbacks"] += $item->complete_playbacks;
            $arr["time_spent"] += $item->time_spent;

            // per section
            //if($arr["sections"]["section-" . $item->section] == null){
                $arr["sections"]["section-" . $item->section] = [
                    "title" => $item->section_title,
                    "count_videos" => 0,
                    "total_playback_time" => 0,
                    "relative_playback_time" => 0,
                    "duration" => 0,
                    "total_pause_events" => 0,
                    "total_play_events" => 0,
                    "total_seeked_events" => 0,
                    "total_ended_events" => 0,
                    "complete_playbacks" => 0,
                    "time_spent" => 0,
                    "first_attempt" => 0,
                ];
            //}
            if($arr["sections"]["section-" . $item->section]["first_attempt"] > $item->submission_time){
                $arr["sections"]["section-" . $item->section]["first_attempt"] = $item->submission_time;
            }
            $arr["sections"]["section-" . $item->section]["count_videos"]++;
            $arr["sections"]["section-" . $item->section]["total_playback_time"] += $item->total_playback_time;
            $arr["sections"]["section-" . $item->section]["relative_playback_time"] += $item->relative_playback_time;
            $arr["sections"]["section-" . $item->section]["duration"] += $item->duration;
            $arr["sections"]["section-" . $item->section]["total_pause_events"] += $item->total_pause_events;
            $arr["sections"]["section-" . $item->section]["total_play_events"] += $item->total_play_events;
            $arr["sections"]["section-" . $item->section]["total_seeked_events"] += $item->total_seeked_events;
            $arr["sections"]["section-" . $item->section]["total_ended_events"] += $item->total_ended_events;
            $arr["sections"]["section-" . $item->section]["complete_playbacks"] += $item->complete_playbacks;
            $arr["sections"]["section-" . $item->section]["time_spent"] += $item->time_spent;
            
        }        
        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';

        return $arr;
    }
}