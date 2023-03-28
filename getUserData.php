<?php

require('../../config.php');
require_once('lib.php');
require_login();


global $DB;



$user_id = $_REQUEST["uID"];

$course_id = $_REQUEST["cID"];

$actionview = "viewed";
$target = "course";

$timePeriod = $_REQUEST["tperiod"];

$blank = "---";

$activity_array = array(
    "course_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank,
        "total_sessions" => $blank,
        "total_time_spent" => $blank,
        "ratio_active_days" => $blank,
        "activity_sequence_last7days" => $blank,
        "selected_goal" => $blank,
        "course_unit_completion" => $blank,
        "course_unit_success" => $blank
    ),
    "assign_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank,
        "sessions" => $blank,
        "time_spent" => $blank,
        "submissions_per_instance" => $blank,
        "scores" => $blank
    ),
    "quiz_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank,
        "sessions" => $blank,
        "time_spent" => $blank,
        "count_attempts" => $blank,
        "count_unique_quizes" => $blank,
        "count_unique_repeated_quizes" => $blank,
        "count_attempts_per_quiz" => $blank,
        "avg_attempt_time_per_task" => $blank,
        "reattempt_delay" => $blank,
        "scores" => $blank
    ),
    "safran_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank,
        "sessions" => $blank,
        "time_spent" => $blank,
    ),
    "longpage_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank,
        "sessions" => $blank,
        "time_spent" => $blank,
        "ratio_read_text" => $blank,
        "count_opened_quizzes" => $blank,
        "count_marks" => $blank,
        "count_bookmarks" => $blank,
        "count_public_comments" => $blank,
        "count_private_comments" => $blank
    ),
    "dashboard_activity" => array(
        "count_goal_changes" => $blank,
        "count_reflection_attempts" => $blank,
        "count_reflection_submissions" => $blank,
        "count_bookmark_additions" => $blank
    ),
    "hypervideo_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank,
    )
);

$from = 0;
$to = 0;

$dayInSeconds = 86400;

$session_timeout = 1800;  // 1800s = 30m

// we use this to guess the time a user had interaction with a course within a single session when we dont have further data available
$assumedTimeSpent = 300; // = 300s = 5m 

// todo: clean it up and make it safer
$periodArray = [
    new DateTimeImmutable("2018-03-01"),
    new DateTimeImmutable("2018-09-01"),
    new DateTimeImmutable("2019-03-01"),
    new DateTimeImmutable("2019-09-01"),
    new DateTimeImmutable("2020-03-01"),
    new DateTimeImmutable("2020-09-01"),
    new DateTimeImmutable("2021-03-01"),
    new DateTimeImmutable("2021-09-01"),
    new DateTimeImmutable("2022-03-01"),
    new DateTimeImmutable("2022-09-01"),
    new DateTimeImmutable("2023-03-01"),
    new DateTimeImmutable("2023-09-01"),
    new DateTimeImmutable("2024-03-01")
];

$addTimePeriodToQuery = "";
function timePeriodToSemesterInterval($startDate, $periodArray)
{

    $from = $periodArray[$startDate];
    $fromInU = $from->format("U");

    $to = $periodArray[$startDate + 1]->sub(new DateInterval('P1D'));

    $toInU = $to->format("U");

    $addTimePeriodToQuery = " AND
    timecreated > " . $fromInU . " AND
    timecreated < " . $toInU . "";

    return $addTimePeriodToQuery;
}

if ($timePeriod !== "none") {
    $addTimePeriodToQuery = timePeriodToSemesterInterval($timePeriod, $periodArray);
}


// function queryGenerator($activityArray, $courseID, $userID, $component, $action, $TimePeriodToQuery)
// {
//     $queriesFaLa = [];

//     foreach ($activityArray as $component => $activity) {

//         $convertComponent = "mod_" . explode("_", $component)[0];
//         if ($convertComponent === "mod_course") {
//             $convertComponent = "core";
//         }
//         $queriesFaLa[$component] = "
//         SELECT 
//             MIN(timecreated) AS first_access,
//             MAX(timecreated) AS last_access
//         FROM {logstore_standard_log}
//         WHERE 
//             courseid = $courseID AND
//             userid = $userID AND
//             component = $component AND
//             action = $action
//             $TimePeriodToQuery
//         ";
//     }

//     $queryFaLa_template = "
//     SELECT 
//         MIN(timecreated) AS first_access,
//         MAX(timecreated) AS last_access
//     FROM {logstore_standard_log}
//     WHERE 
//         courseid = $courseID AND
//         userid = ? $userID AND
//         component = ? $component AND
//         action = $action AND
//         $TimePeriodToQuery
//     ";

//     return $queriesFaLa;
// };



$query_course_fa_la = "
SELECT 
    MIN(timecreated) AS first_access,
    MAX(timecreated) AS last_access
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ?" . $addTimePeriodToQuery . "
";

$query_course_access = "
SELECT 
    timecreated,
    component,
    contextid
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ?$addTimePeriodToQuery
ORDER BY timecreated ASC
";

$query_activity_fa_la = "
SELECT 
    MIN(timecreated) AS first_access,
    MAX(timecreated) AS last_access 
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? AND
    component = ?$addTimePeriodToQuery
";

$query_activity_access = "
SELECT 
    timecreated
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? AND
    component = ?
    $addTimePeriodToQuery
ORDER BY timecreated ASC
";



// $year = $today->format("y");

// echo print_r("today " . $today->format("y-m-d") . " year " . $year);

// $sumSem = new DateTime($year . '-03-01', new DateTimeZone('Europe/Berlin'));

// echo $sumSem->format(" y-m-d");

// $winSem = new DateTimeImmutable($year . '-09-01', new DateTimeZone('Europe/Berlin'));

// echo $winSem->format(" y-m-d ");



$lastRecord = 0;
$sessions = 0;
$timeSpent = 0;

$activeDays = 0;
$lastDay = 0;



$today = new DateTimeImmutable("now", new DateTimeZone('Europe/Berlin'));

$sevenDaysAgo = $today->sub(new DateInterval('P7D'));

$sevenDaysAgoInU = $sevenDaysAgo->format("U");

$activitySequenceLast7Days = [];




$recordsActivityFaLa = array();
$recordsActivityAccess = array();
$recordsCourseAccess;


// fetch records from DB

$start = microtime(true);       // measuring time of db query

foreach ($activity_array as $activityName => $activityArr) {

    $convertComponent = "mod_" . explode("_", $activityName)[0];
    if ($convertComponent === "mod_course") {
        // queries for the whole course 
        $recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_course_fa_la, array($course_id, $user_id));
        $recordsCourseAccess = $DB->get_records_sql($query_course_access, array($course_id, $user_id));
        continue;
    }
    // queries for activities
    $recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_activity_fa_la, array($course_id, $user_id, $convertComponent));
    $recordsActivityAccess[$activityName] = $DB->get_records_sql($query_activity_access, array($course_id, $user_id, $convertComponent));
}


$elapsedTime = microtime(true) - $start;

echo "<div>ElapsedTime(DBfetch): " . number_format($elapsedTime, 10) . " us</div>";



//insert first_access and last_access data from DB into activity_array
foreach ($recordsActivityFaLa as $activityName => $activityArr) {
    foreach ($activityArr as $dataKey => $data) {
        if ($data != 0) $activity_array[$activityName][$dataKey] = Date("d.m.y, H:i:s", $data);
    }
}

//echo print_r($recordsCourseAccess);

$lastRecord = 0;
$sessions = 0;
$timeSpent = 0;

$activeDays = 0;
$lastDay = 0;

// calculate sessions,total time spent and ratio of active days for the whole course
// collect activity of last 7 days ($activitySequenceLast7Days[])
foreach ($recordsCourseAccess as $singleRecord) {
    if ($singleRecord->timecreated < 1000) continue;    // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
    if ((int)Date("z", $singleRecord->timecreated) != (int)$lastDay) $activeDays++;
    if ($singleRecord->timecreated > $sevenDaysAgoInU && $singleRecord->component != "core") $activitySequenceLast7Days[] = $singleRecord->component . ":" . $singleRecord->contextid;
    if (($lastRecord + $session_timeout) < $singleRecord->timecreated) {     // time difference between 2 events is larger than $session_timeout ? must be a new session
        $sessions++;
        $timeSpent += $assumedTimeSpent;
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
    $lastDay = Date("z", $lastRecord);
    //echo $lastDay."<br>";
}

$hours = $timeSpent / 3600;
$hours = floor($hours);
$minutes = ($timeSpent - ($hours * 3600)) / 60;
$minutes = floor($minutes);
$seconds = ($timeSpent - (($hours * 3600) + ($minutes * 60)));

$timeSpentFormatted = $hours . " h " . $minutes . " m " . $seconds . " s";

if ($timePeriod !== 'none') {

    $today = new DateTimeImmutable("now", new DateTimeZone('Europe/Berlin'));
    $from = $periodArray[$timePeriod];
    $diff = $today->diff($from);

    echo $diff->format("%r%a days");

    echo $diff->format(" %a DIFF");

    $semesterDays = (int)$diff->format("%a");

    if ($semesterDays > 180) $semesterDays = 180;

    $ratioActiveDays = $activeDays . " / " . $semesterDays . " = " . number_format($activeDays / $semesterDays, 4);
} else {
    $ratioActiveDays = "---";
}

$activity_array["course_activity"]["total_sessions"] = $sessions;
$activity_array["course_activity"]["total_time_spent"] = $timeSpentFormatted;
$activity_array["course_activity"]["ratio_active_days"] = $ratioActiveDays;
$activity_array["course_activity"]["activity_sequence_last7days"] = $activitySequenceLast7Days;



//calculate sessions and time spent for individual activities
foreach ($recordsActivityAccess as $activityName => $activityArr) {
    $lastRecord = 0;
    $sessions = 0;
    $timeSpent = 0;

    $activeDays = 0;
    $lastDay = 0;
    foreach ($activityArr as $dataKey => $data) {
        //$activity_array[$activityName][$dataKey] = Date("d.m.y, H:i:s", $data);
        if ($data->timecreated < 1000) continue;    // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
        //if ((int)Date("z", $data->timecreated) != (int)$lastDay) $activeDays++;
        //if ($data->timecreated > $sevenDaysAgoInU && $data->component != "core") $activitySequenceLast7Days[] = $data->component . ":" . $data->contextid;
        if (($lastRecord + $session_timeout) < $data->timecreated) {     // time difference between 2 events is larger than $session_timeout ? must be a new session
            $sessions++;
            $timeSpent += $assumedTimeSpent;
        } else {
            /**
             * 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
             * however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
             * TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
             * logged) and add that to the calculation
             */
            $timeSpent += $data->timecreated - $lastRecord;
        }
        $lastRecord = $data->timecreated;
        //$lastDay = Date("z", $lastRecord);

    }
    $hours = $timeSpent / 3600;
    $hours = floor($hours);
    $minutes = ($timeSpent - ($hours * 3600)) / 60;
    $minutes = floor($minutes);
    $seconds = ($timeSpent - (($hours * 3600) + ($minutes * 60)));

    $timeSpentFormatted = $hours . " h " . $minutes . " m " . $seconds . " s";
    if ($sessions != 0) $activity_array[$activityName]["sessions"] = $sessions;
    if ($timeSpent != 0) $activity_array[$activityName]["time_spent"] = $timeSpentFormatted;
}




// generate html from data (activity_array)
foreach ($activity_array as $key1 => $activity) {
    echo "<strong>" . $key1 . "</strong><br>";

    $table_headers = "<thead><tr>";
    $table_data = "<tbody><tr>";

    foreach ($activity as $key2 => $entry) {
        $table_headers .= "<th>" . $key2 . " </th>";
        if (is_array($entry)) {
            $arrayInTable = "<div id='arrayInTableStyle'>";
            foreach ($entry as $key => $arrayEntry) {
                $arrayInTable .= "<div>$arrayEntry</div>";
            }
            $arrayInTable .= "</div>";
            $table_data .= "<td>" . $arrayInTable . " </td>";
        } else {
            $table_data .= "<td>" . $entry . " </td>";
        }
    }
    echo "<div><table>" . $table_headers . "</tr></thead>" . $table_data . "</tr></tbody></table></div>";
}

/*
userid: number;
courseid: number; 
course_activity?: {
        first_access?: Date; oder timestamp
        last_access?: Date; oder timestamo
        count_total_sessions?: number; 
        total_time_spent?: Array<number>; Zeit in Sekunden o.ä.
        ratio_active_days?: number;  Anzahl der Tag, an denen die Person aktiv war im Verhältnis zur Gesamtzahl an Tagen seit Semesterbeginn
        activity_sequence_last7days?: Map<string,number>; Sequenz ohne Datum bestehend aus dem Bezeichner der Aktivität un der ID der jeweiligen Instanz. Bei Safran braucht man vermutlich zwei IDs. z.B. mod_longpage:12, mod_safran:198, mod_assign_23 
        selected_goal?: string; Siehe component='format_ladtopics' im logstore und goal_changed o.ä. 
        course_unit_completion?: Map<number, number>; z.B. 'meine Kurs-Sektion':0.81, 'KE 1':0.12, 'KE2':0.99
        course_unit_success?: Map<number, number>; Wie viele Aufgaben von den bearbeiteten Aufgaben waren korrekt. z.B. 'meine Kurs-Sektion':0.81, 'KE 1':0.12, 'KE2':0.99
    };
 */
