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
    ),
    "format_ladtopics_activity" => array(
        "first_access" => $blank,
        "last_access" => $blank
    )
);

$from = 0;
$to = 0;

$fromInU = 0;
$toInU = 0;

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
$addTimePeriodToQuerySafran = "";           //column timecreated is flawed in one of the safran tables, we need a custom query
function timePeriodToSemesterInterval($startDate, $periodArray, $timeCreatedPrefix = "")
{

    $from = $periodArray[$startDate];
    $fromInU = $from->format("U");

    $to = $periodArray[$startDate + 1]->sub(new DateInterval('P1D'));

    $toInU = $to->format("U");

    $addTimePeriodToQuery = " AND ".
    $timeCreatedPrefix."timecreated > " . $fromInU . " AND ".
    $timeCreatedPrefix."timecreated < " . $toInU . "";

    return $addTimePeriodToQuery;
}

if ($timePeriod !== "none") {
    $addTimePeriodToQuery = timePeriodToSemesterInterval($timePeriod, $periodArray);
    $addTimePeriodToQuerySafran = timePeriodToSemesterInterval($timePeriod, $periodArray, "sqa.");
}

function timeUtoHMS($timeInU)
{
    $hours = $timeInU / 3600;
    $hours = floor($hours);
    $minutes = ($timeInU - ($hours * 3600)) / 60;
    $minutes = floor($minutes);
    $seconds = ($timeInU - (($hours * 3600) + ($minutes * 60)));

    $timeSpentFormatted = $hours . " h " . $minutes . " m " . $seconds . " s";

    return $timeSpentFormatted;
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
    userid = ? AND
    timecreated > 1000" . $addTimePeriodToQuery . "        
";
// some entries in the db have a timestamp = 0 or below 1000. dont consider these

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
    component = ? AND
    timecreated > 1000$addTimePeriodToQuery
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

$query_submissions = "
SELECT 
    ag.grade AS scores
FROM {assign} AS assign
JOIN {assign_grades} AS ag
    ON ag.assignment = assign.id
WHERE 
    course = ? AND
    userid = ?
    $addTimePeriodToQuery
ORDER BY timecreated ASC
";

// $query_quiz_attempts = "
// SELECT
//     qu.name,
//     qua.attempt
// FROM {quiz} AS qu
// JOIN {quiz_attempts} AS qua
//     ON qu.id = qua.quiz
// WHERE 
//     qu.course = ? AND
//     qua.userid = ?
//     $addTimePeriodToQuery
// ORDER BY timecreated ASC
// ";

$query_quiz_attempts = "
SELECT
    AVG(qua.timefinish - qua.timestart) as avgTime,
    MAX(qua.attempt) as attempts,
    qu.name
FROM {quiz} AS qu
JOIN {quiz_attempts} AS qua
    ON qu.id = qua.quiz
WHERE 
    qu.course = ? AND
    qua.userid = ? AND
    qua.state = 'finished'
    $addTimePeriodToQuery
GROUP BY qu.name
";
// ^ORDER BY timecreated ASC


$query_quiz_scores = "
SELECT
    qu.name,
    qug.grade
FROM {quiz} as qu
JOIN {quiz_grades} as qug
    ON qu.id=qug.quiz
WHERE  
    qu.course = ? AND
    qug.userid = ?
";

// $query_course_modules = "
// SELECT 
//     count(*)
// FROM {course_modules}
// WHERE 
//     course = ? AND
//     $addTimePeriodToQuery
// ORDER BY timecreated ASC
// "
// ;

// old completion query, considers all complete modlues
// $query_course_modules_completion = "
// SELECT
//     coursemoduleid,
//     completionstate
// FROM {course_modules_completion} as cmc
// JOIN {course_modules} as cm
//     ON cmc.coursemoduleid=cm.id
// WHERE  
//     cm.course = ? AND
//     userid = ?
// ORDER BY added ASC
// ";

// considers only assign, quiz and safran
$query_course_modules_completion = "
SELECT
    coursemoduleid,
    completionstate
FROM {course_modules_completion} as cmc,
    {course_modules} as cm,
    {modules} as m
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



$query_safran_fa_la = "
SELECT 
MIN(sqa.timecreated) AS first_access,
MAX(sqa.timecreated) AS last_access 
FROM {safran_q_attempt} as sqa,
    {safran_question} as sq,
    {safran} as s
WHERE 
sqa.userid = ? AND
sqa.timecreated > 1000 AND
sqa.questionid = sq.id AND
sq.course = s.id AND
s.course = ?
$addTimePeriodToQuerySafran
";

$query_safran_access = "
SELECT 
    sqa.timecreated
FROM {safran_q_attempt} as sqa,
    {safran_question} as sq,
    {safran} as s
WHERE 
sqa.userid = ? AND
sqa.timecreated > 1000 AND
sqa.questionid = sq.id AND
sq.course = s.id AND
s.course = ?
    $addTimePeriodToQuerySafran
ORDER BY sqa.timecreated ASC
";


// !! column "timecreated" of format_ladtopics in the logstore_standard_log always contains value 0
// timecreated is stored in column "other" instead. example value is "{""utc"":1569919746739   


// $query_activity_ladtopics_fa_la = "
// SELECT 
//     MIN(timecreated) AS first_access,
//     MAX(timecreated) AS last_access 
// FROM {logstore_standard_log}
// WHERE 
//     courseid = ? AND
//     userid = ? AND
//     component = ? AND
//     timecreated > 1000$addTimePeriodToQuery
// ";

$query_activity_ladtopics_access = "
SELECT 
    other
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? AND
    component = ?
";

// comments are saved in this table
// 0 = marked text, 1 = annotation, 2 = bookmarks
$query_longpage_posts = "
SELECT
    SUM(lp.ispublic) as sum,
    COUNT(lp.id) as count
FROM {longpage_posts} AS lp,
    {longpage} AS l
WHERE l.course = ? AND
    lp.creatorid = ? AND
    lp.longpageid = l.id
    $addTimePeriodToQuery
";

$query_longpage_annotations = "
SELECT la.id,
        type,
        ispublic,
        longpageid
FROM {longpage_annotations} as la,
    {longpage} as l
WHERE l.course = ? AND
    la.creatorid = ? AND
    la.longpageid = l.id
    $addTimePeriodToQuery
";

// todo add time period
$query_longpage_instances = "
SELECT
    name,
    id
FROM
    {longpage}
WHERE
    course = ?
";

$query_longpage_reading_progress = "
SELECT
    COUNT(DISTINCT section) as count,
    sectioncount,
    longpageid
FROM {longpage_reading_progress}
WHERE course = ? AND
    userid = ?
GROUP BY
    longpageid, sectioncount
";


// query doesnt continue execution after IFNULL(...), thats why its at the end of the select statement
$query_course_sections = "
SELECT 
    sequence, IFNULL(name, 'NoName') as name
FROM {course_sections}
WHERE 
    course = ?
";
//SELECT name, sequence from course_sections where course = ? ORDER BY timemodified ASC

//SELECT coursemoduleid from course_modules_completion as cmc join course_modules as cm on cmc.coursemoduleid=cm.id where userid = ? AND cm.course = ? ORDER BY added ASC

$queries_activites = [
    "mod_assign" => ["submissions" => $query_submissions],
    "mod_quiz" => ["query1" => ""],
    "mod_safran" => ["query1" => ""],
    "mod_longpage" => ["query1" => ""],
    "dashboard" => ["query1" => ""],
    "mod_hypervideo" => ["query1" => ""],
];


// foreach ($activity_array as $activityName => $activityArr) {
//     $queries_activites[$activityName];
// }




// $year = $today->format("y");

// echo print_r("today " . $today->format("y-m-d") . " year " . $year);

// $sumSem = new DateTime$year . '-03-01', new DateTimeZone('Europe/Berlin'));

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

$dbman = $DB->get_manager();

// fetch common records of activites (access times) from DB

$start = microtime(true);       // measuring time of db query

foreach ($activity_array as $activityName => $activityArr) {

    $convertComponent = "mod_" . explode("_", $activityName)[0];    // prefix 'mod_' is relevant to entries in logstore_standard_log
    if ($convertComponent === "mod_course") {
        // queries for the whole course 
        $recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_course_fa_la, array($course_id, $user_id));
        $recordsCourseAccess = $DB->get_records_sql($query_course_access, array($course_id, $user_id));
        continue;
    }
    // queries for activities with common attributes
    if ($dbman->table_exists(explode("_", $activityName)[0])) {
        $recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_activity_fa_la, array($course_id, $user_id, $convertComponent));
        $recordsActivityAccess[$activityName] = $DB->get_records_sql($query_activity_access, array($course_id, $user_id, $convertComponent));
    }
    // ladtopics is special
    if ($activityName == "format_ladtopics_activity"){
        $convertComponent = "format_ladtopics";
        //$tmparr = array();
        //$recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_activity_fa_la, array($course_id, $user_id, $convertComponent));
        //$recordsActivityAccess[$activityName] = $DB->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, $convertComponent));
        //$tmparr = $DB->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, $convertComponent));

        //print_r($recordsActivityFaLa[$activityName]);
        //print_r($recordsActivityAccess[$activityName]);
    }

}

// fetch uncommon records of activities
$records_subs = $DB->get_records_sql($query_submissions, array($course_id, $user_id));

$records_quiz_attempts = $DB->get_records_sql($query_quiz_attempts, array($course_id, $user_id));

$records_course_sections = $DB->get_records_sql($query_course_sections, array($course_id));

$records_course_modules_completion = $DB->get_records_sql($query_course_modules_completion, array($course_id, $user_id));

$records_quiz_scores = $DB->get_records_sql($query_quiz_scores, array($course_id, $user_id));

if ($dbman->table_exists("safran_q_attempt")) {
    $records_safran_fa_la = $DB->get_record_sql($query_safran_fa_la, array($user_id, $course_id));
    $records_safran_access = $DB->get_records_sql($query_safran_access, array($user_id, $course_id));
}

$records_format_ladtopics_fa_la_access = $DB->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, "format_ladtopics"));

if ($dbman->table_exists("longpage")){
    $records_longpage_posts = $DB->get_record_sql($query_longpage_posts, array($course_id, $user_id));
    $records_longpage_annotations = $DB->get_records_sql($query_longpage_annotations, array($course_id, $user_id));
    $records_longpage_reading_progress = $DB->get_records_sql($query_longpage_reading_progress, array($course_id, $user_id));
    $records_longpage_instances = $DB->get_records_sql($query_longpage_instances, array($course_id));
}

// echo print_r($records_course_sections);
// echo "<br>";
// echo print_r($records_course_modules_completion);


echo print_r($records_safran_fa_la);

//print_r($recordsActivityFaLa);

$elapsedTime = microtime(true) - $start;

echo "<div>ElapsedTime(DBfetch): " . number_format($elapsedTime, 10) . " us</div>";



//insert first_access and last_access data from DB into activity_array
foreach ($recordsActivityFaLa as $activityName => $activityArr) {
    foreach ($activityArr as $dataKey => $data) {
        if ($data != 0) $activity_array[$activityName][$dataKey] = Date("d.m.y, H:i:s", $data);
    }
}

// uncommon records insert start
if (count($records_subs) > 0) {
    $tmparr = array();

    foreach ($records_subs as $singleRecord) {
        $tmparr[] = number_format($singleRecord->scores, 0);
    }
    $activity_array["assign_activity"]["submissions_per_instance"] = count($records_subs);
    $activity_array["assign_activity"]["scores"] = $tmparr;
}

if (count($records_quiz_attempts) > 0) {
    $tmparr = array();
    $tmparr2 = array();
    $tmp = 0;
    $tmp2 = 0;

    foreach ($records_quiz_attempts as $singleRecord) {
        $tmp += $singleRecord->attempts;
        if ($singleRecord->attempts != 1) $tmp2++;
        $tmparr[] = $singleRecord->name . ": " . $singleRecord->attempts;
        $tmparr2[] = $singleRecord->name . ": " . timeUtoHMS(floor($singleRecord->avgtime));
        print_r($singleRecord);
    }
    $activity_array["quiz_activity"]["count_attempts"] = $tmp;
    $activity_array["quiz_activity"]["count_unique_quizes"] = count($records_quiz_attempts);
    $activity_array["quiz_activity"]["count_unique_repeated_quizes"] = $tmp2;
    $activity_array["quiz_activity"]["avg_attempt_time_per_task"] = $tmparr2;
    $activity_array["quiz_activity"]["count_attempts_per_quiz"] = $tmparr;
}

if (count($records_course_sections) > 0) {
    $tmparr1 = array();
    $tmparr2 = array();
    foreach ($records_course_sections as $singleRecord) {
        $completions = 0;
        $completions_success = 0;

        $modulesInSection = count(explode(",", $singleRecord->sequence));

        foreach ($records_course_modules_completion as $singleRecord2) {
            if ($singleRecord2->completionstate == 0) continue;
            if (strpos($singleRecord->sequence, $singleRecord2->coursemoduleid)) {
                $completions++;        // count total amount of completed modules 
                // Available states: 0 = not completed if there’s no row in this table, 
                // that also counts as 0. 1 = completed 2 = completed, show passed 3 = completed, show failed
                if ($singleRecord2->completionstate == 2) $completions_success++;
            }
        }
        // $tmparr[] = array(
        //     "section_name" => $singleRecord->name,
        //     "completion_ratio" => $completions / count(explode(",", $singleRecord->sequence)),
        //     "success_ration" => $completions_success / $completions
        // );
        if ($modulesInSection != 0) $tmparr1[] = $singleRecord->name . ": " . number_format($completions / $modulesInSection, 2);
        if ($completions != 0) $tmparr2[] = $singleRecord->name . ": " . number_format($completions_success / $completions, 2);
        // $tmparr1[] = $singleRecord->name . ": " . number_format($completions / $modulesInSection, 2);
        // $tmparr2[] = $singleRecord->name . ": " . number_format($completions_success / $completions, 2);
    }
    $activity_array["course_activity"]["course_unit_completion"] = $tmparr1;
    $activity_array["course_activity"]["course_unit_success"] = $tmparr2;
}

if (count($records_quiz_scores) > 0) {
    $tmparr = array();
    $tmp = 0;

    //print_r($records_quiz_attempts);
    foreach ($records_quiz_scores as $singleRecord) {
        $tmparr[] = $singleRecord->name . ": " . number_format($singleRecord->grade, 2);
    }
    $activity_array["quiz_activity"]["scores"] = $tmparr;
}

if (count($records_safran_fa_la) > 0) {

    $activity_array["safran_activity"]["first_access"] = Date("d.m.y, H:i:s", $records_safran_fa_la->first_access);
    $activity_array["safran_activity"]["last_access"] = Date("d.m.y, H:i:s", $records_safran_fa_la->last_access);
}

if (count($records_safran_access) > 0) {

    $sessionsSafran = 0;
    $timeSpentSafran = 0;
    $lastRecordSafran = 0;

    foreach ($records_safran_access as $singleRecord) {
        if ($singleRecord->timecreated < 1000) continue;    // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
        if (($lastRecordSafran + $session_timeout) < $singleRecord->timecreated) {     // time difference between 2 events is larger than $session_timeout ? must be a new session
            $sessionsSafran++;
            $timeSpentSafran += $assumedTimeSpent;
        } else {
            /**
             * 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
             * however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
             * TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
             * logged) and add that to the calculation
             */
            $timeSpentSafran += $singleRecord->timecreated - $lastRecordSafran;
        }
        $lastRecordSafran = $singleRecord->timecreated;
        //echo $lastDay."<br>";
    }



    $activity_array["safran_activity"]["sessions"] = $sessionsSafran;
    $activity_array["safran_activity"]["time_spent"] = timeUToHMS($timeSpentSafran);
}

if (count($records_format_ladtopics_fa_la_access) > 0){
    $tmparr = array();
    foreach($records_format_ladtopics_fa_la_access as $singleRecord){
        $tmparr[] = explode(":", $singleRecord->other)[1];    // data is in format:         "{""utc"":1569919746765
    }

    sort($tmparr);

    $activity_array["format_ladtopics_activity"]["first_access"] = Date("d.m.y, H:i:s", $tmparr[0]);
    $activity_array["format_ladtopics_activity"]["last_access"] = Date("d.m.y, H:i:s", $tmparr[count($tmparr) - 1]);

    $lastRecordLadtopics = 0;
    $timeSpentLadtopics = 0;
    $sessionsLadtopics = 0;

    foreach ($tmparr as $singleRecord) {
        if ($singleRecord < 1000) continue;    // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
        if ($timePeriod !== "none") {
            if ($singleRecord < $fromInU || $singleRecord > $toInU) continue;
        }

        if (($lastRecordLadtopics + $session_timeout) < $singleRecord) {     // time difference between 2 events is larger than $session_timeout ? must be a new session
            $sessionsLadtopics++;
            $timeSpentLadtopics += $assumedTimeSpent;
        } else {
            /**
             * 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
             * however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
             * TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
             * logged) and add that to the calculation
             */
            $timeSpentLadtopics += $singleRecord - $lastRecordLadtopics;
        }
        $lastRecordLadtopics = $singleRecord;
    }

    $activity_array["format_ladtopics_activity"]["sessions"] = $sessionsLadtopics;
    $activity_array["format_ladtopics_activity"]["time_spent"] = timeUToHMS($timeSpentLadtopics);
}

if (count($records_longpage_annotations) > 0){
    

    $marks = 0;
    $bookmarks = 0;
    $publicComments = 0;
    $privateComments = 0;

    $tmparr = array();

    print_r($records_longpage_annotations);

    foreach($records_longpage_annotations as $singleRecord){
        if ($singleRecord->type == 0) $marks++;
        if ($singleRecord->type == 1){
            if ($singleRecord->ispublic == 1) $publicComments++;
            if ($singleRecord->ispublic == 0) $privateComments++;
        }
        if ($singleRecord->type == 2) $bookmarks++;
    }

    foreach($records_longpage_instances as $singleRecord){
        $tmparr[$singleRecord->id] = array("name" => $singleRecord->name);
    }
    foreach($records_longpage_reading_progress as $singleRecord){
        $tmparr[$singleRecord->longpageid] = array("count" => $singleRecord->count,
        "sectioncount" => $singleRecord->sectioncount);
    }
    print_r($tmparr);

    $activity_array["longpage_activity"]["count_marks"] = $marks;
    $activity_array["longpage_activity"]["count_bookmarks"] = $bookmarks;
    $activity_array["longpage_activity"]["count_public_comments"] = $publicComments;
    $activity_array["longpage_activity"]["count_private_comments"] = $privateComments;
}

// uncommon records insert end

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



$totalTimeSpent = timeUtoHMS($timeSpent);

if ($timePeriod !== 'none') {

    $today = new DateTimeImmutable("now", new DateTimeZone('Europe/Berlin'));
    $from = $periodArray[$timePeriod];
    $diff = $today->diff($from);

    //echo $diff->format("%r%a days");

    //echo $diff->format(" %a DIFF");

    $semesterDays = (int)$diff->format("%a");

    if ($semesterDays > 180) $semesterDays = 180;

    $ratioActiveDays = $activeDays . " / " . $semesterDays . " = " . number_format($activeDays / $semesterDays, 4);
} else {
    $ratioActiveDays = "---";
}

$activity_array["course_activity"]["total_sessions"] = $sessions;
$activity_array["course_activity"]["total_time_spent"] = $totalTimeSpent;
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

    $timeSpentFormatted = timeUtoHMS($timeSpent);
    if ($sessions != 0) $activity_array[$activityName]["sessions"] = $sessions;
    if ($timeSpent != 0) $activity_array[$activityName]["time_spent"] = $timeSpentFormatted;
}




// generate html from data (activity_array)
foreach ($activity_array as $key1 => $activity) {
    echo "<strong class='activityDescription'>" . $key1 . "</strong><br>";

    $table_headers = "<thead><tr>";
    $table_data = "<tbody><tr>";

    foreach ($activity as $key2 => $entry) {
        $table_headers .= "<th>" . $key2 . " </th>";
        if (is_array($entry)) {
            $arrayInTable = "<div class='arrayInTableStyle'>";
            foreach ($entry as $key => $arrayEntry) {
                $arrayInTable .= "<div>$arrayEntry</div>";
            }
            $arrayInTable .= "</div>";
            $table_data .= "<td>" . $arrayInTable . " </td>";
        } else {
            $table_data .= "<td>" . $entry . " </td>";
        }
    }
    echo "<div><table>" . $table_headers . "</tr></thead>" . $table_data . "</tr></tbody></table></div><br>";
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
