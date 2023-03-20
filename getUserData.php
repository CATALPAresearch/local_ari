<?php

require('../../config.php');
require_once('lib.php');
require_login();


global $DB;

$user_id = $_REQUEST["q"];

$course_id = $_REQUEST["cID"];

$actionview = "viewed";
$target = "course";


$query_first_access = "
SELECT 
    MIN(timecreated) AS first_access 
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? AND
    action = ? AND
    target = ?
";
$query_last_access = "
SELECT 
    MAX(timecreated) AS last_access 
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? AND
    action = ? AND
    target = ?
";



$query_access = "
SELECT 
    timecreated
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ?
ORDER BY timecreated ASC
";

$query_assign = "
SELECT 
    timecreated AS first_access
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? AND
    component = ? AND
    action = ?
ORDER BY timecreated ASC
";






$records1 = $DB->get_record_sql($query_first_access, array($course_id, $user_id, $actionview, $target));
$records2 = $DB->get_record_sql($query_last_access, array($course_id, $user_id, $actionview, $target));


$start = microtime(true);       // measuring time of db query

$records3 = $DB->get_records_sql($query_access, array($course_id, $user_id));

$elapsedTime = microtime(true) - $start;

$records4 = $DB->get_record_sql($query_assign, array($course_id, $user_id, "mod_assign", "viewed"));



echo "<div><span>UserID: $user_id</span></div>";
echo "<div>ElapsedTime(records3): ".$elapsedTime." us</div>";


$lastRecord = 0;
$sessions = 0;
$timeSpent = 0;


foreach ($records3 as $singleRecord) {
    if ($singleRecord->timecreated < 1000) continue;            // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000
    if (($lastRecord + $session_timeout) < $singleRecord->timecreated) {     // time difference between 2 events is larger than $session_timeout ? must be a new session
        $sessions++;
    } else {
        /**
         * 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
         * however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
         * TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
         * logged) and add that to the calculation
         */
        $timeSpent += $singleRecord->timecreated - $lastRecord;
    }
    $lastRecord = $singleRecord->timecreated;
}


$firstaccess = Date("d.m.y, H:i:s", $records1->first_access);
$lastaccess = Date("d.m.y, H:i:s", $records2->last_access);

// test

// $timeSpent2 = 0;

// foreach ($records4 as $singleRecord) {
//     if ($singleRecord->timecreated < 1000) continue;            // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000
//     if (($lastRecord + $session_timeout) < $singleRecord->timecreated) {     // time difference between 2 events is larger than $session_timeout ? must be a new session
//         //$sessions++;
//     } else {
//         /**
//          * 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
//          * however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
//          * TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
//          * logged) and add that to the calculation
//          */
//         $timeSpent2 += $singleRecord->timecreated - $lastRecord;
//     }
//     $lastRecord = $singleRecord->timecreated;
// }


$firstaccess2 = Date("d.m.y, H:i:s", $records4->first_access);
//$lastaccess = Date("d.m.y, H:i:s", $records2->last_access);

//test end

$activity_array = array(
    "course_activity" => array(
        "first_access" => $firstaccess,
        "last_access" => $lastaccess,
        "total_sessions" => $sessions,
        "total_time_spent" => $timeSpent,
        "ratio_active_days" => 0,
        "activity_sequence_last7days" => 0,
        "selected_goal" => 0,
        "course_unit_completion" => 0,
        "course_unit_success" => 0
    ),
    "assignment_activity" => array(
        "first_access" => $firstaccess2,
        "last_access" => 0,
        "sessions" => 0,
        "time_spent" => 0,
        "submissions_per_instance" => 0,
        "scores" => 0
    ),
    "quiz_activity" => array(
        "first_access" => 0,
        "last_access" => 0,
        "sessions" => 0,
        "time_spent" => 0,
        "count_attempts" => 0,
        "count_unique_quizes" => 0,
        "count_unique_repeated_quizes" => 0,
        "count_attempts_per_quiz" => 0,
        "avg_attempt_time_per_task" => 0,
        "reattempt_delay" => 0,
        "scores" => 0
    ),
    "safran_activity" => array(
        "first_access" => 0,
        "last_access" => 0,
        "sessions" => 0,
        "time_spent" => 0,
    ),
    "longpage_activity" => array(
        "first_access" => 0,
        "last_access" => 0,
        "sessions" => 0,
        "time_spent" => 0,
        "ratio_read_text" => 0,
        "count_opened_quizzes" => 0,
        "count_marks" => 0,
        "count_bookmarks" => 0,
        "count_public_comments" => 0,
        "count_private_comments" => 0
    ),
    "dashboard_activity" => array(
        "count_goal_changes" => 0,
        "count_reflection_attempts" => 0,
        "count_reflection_submissions" => 0,
        "count_bookmark_additions" => 0
    ),
    "hypervideo_activity" => array(
        "first_access" => 0,
        "last_access" => 0,
    )
);

foreach ($activity_array as $key1 => $activity) {
    echo "<strong>" . $key1 . "</strong><br>";

    $table_headers = "<thead><tr>";
    $table_data = "<tbody><tr>";

    foreach ($activity as $key2 => $entry) {
        $table_headers .= "<th>" . $key2 . " </th>";
        $table_data .= "<td>" . $entry . " </td>";
    }
    echo "<div><table>" . $table_headers . "</tr></thead>" . $table_data . "</tr></tbody></table></div>";
}


?>