<?php

require('../../config.php');
require_once('lib.php');
require_login();

$systemContent = context_system::instance();
require_capability('moodle/analytics:managemodels', $systemContent);

global $DB;
$dubug = '';
$actionview = "viewed";
$target = "course";


# Load request parameters
if(isset($_REQUEST["user_id"])){
    $user_id = $_REQUEST["user_id"];
} else{
    die;
}

if(isset($_REQUEST["course_id"])){
    $course_id = $_REQUEST["course_id"];
} else{
    die;
}

if (isset($_REQUEST["period"])) {
    $timePeriod = $_REQUEST["period"];
} else {
    $timePeriod = 11;
}



# Define data structure
$blank = "---";
$activity_array = array(
    "api_path" => "",
    "execution_time_utc" => "",
    "execution_time" => "",
    "execution_duration" => "",
    "user" => array(
        "user_id" => 0,
        "course_id" => 0,
        "semester" => '',
        "semester_from" => '',
        "semester_to" => '',
    ),
    "course_activity" => array(
        "first_access" => 0,
        "first_access_date" => null,
        "last_access" => 0,
        "last_access_date" => null,
        "number_of_sessions" => 0,
        "mean_session_length" => 0,
        "sd_session_length" => 0,
        "total_time_spent" => 0,
        "total_time_spent_hms" => 0,
        "active_days" => 0,
        "activity_span" => 0,
        "course_overview_page_visits" => 0,
        "goal_changes" => -1,
        "goal_selected" => null,
        "course_unit_completion" => 0,
        "course_unit_success" => 0,
        "activity_sequence_last7days" => array(),
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
        "count_private_comments" => $blank,
        "instances" => array()
    ),
    "questionnaire" => array(),
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
        "first_access_utc" => $blank,
        "last_access" => $blank,
        "sessions" => $blank,
        "time_spent" => $blank,
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



# Handle time periods
$from = 0;
$to = 0;

$fromInU = 0;
$toInU = 0;

$dayInSeconds = 86400;

$session_timeout = 1800;  // 1800s = 30m

// we use this to guess the time a user had interaction with a course within a single session when we dont have further data available
$assumedTimeSpent = 300; // = 300s = 5m 


$periodArray = [
    'WS18' => ['from' => new DateTimeImmutable("2018-10-01"), 'to'=>new DateTimeImmutable("2019-03-31")],
    'SS18' => ['from' => new DateTimeImmutable("2018-04-01"), 'to'=>new DateTimeImmutable("2018-09-30")],
    'WS19' => ['from' => new DateTimeImmutable("2019-10-01"), 'to'=>new DateTimeImmutable("2020-03-31")],
    'SS19' => ['from' => new DateTimeImmutable("2019-04-01"), 'to'=>new DateTimeImmutable("2019-09-30")],
    'WS20' => ['from' => new DateTimeImmutable("2020-10-01"), 'to'=>new DateTimeImmutable("2021-03-31")],
    'SS20' => ['from' => new DateTimeImmutable("2020-04-01"), 'to'=>new DateTimeImmutable("2020-09-30")],
    'WS21' => ['from' => new DateTimeImmutable("2021-10-01"), 'to'=>new DateTimeImmutable("2022-03-31")],
    'SS21' => ['from' => new DateTimeImmutable("2021-04-01"), 'to'=>new DateTimeImmutable("2021-09-30")],
    'WS22' => ['from' => new DateTimeImmutable("2022-10-01"), 'to'=>new DateTimeImmutable("2023-03-31")],
    'SS22' => ['from' => new DateTimeImmutable("2022-04-01"), 'to'=>new DateTimeImmutable("2022-09-30")],
    'WS23' => ['from' => new DateTimeImmutable("2023-10-01"), 'to'=>new DateTimeImmutable("2023-03-31")],
    'SS23' => ['from' => new DateTimeImmutable("2023-04-01"), 'to'=>new DateTimeImmutable("2023-09-30")],
    'WS24' => ['from' => new DateTimeImmutable("2024-10-01"), 'to'=>new DateTimeImmutable("2024-03-31")],
    'SS24' => ['from' => new DateTimeImmutable("2024-04-01"), 'to'=>new DateTimeImmutable("2024-09-30")]
];


# Concat string for filter queries for time ranges
$addTimePeriodToQuery = "";
$addTimePeriodToQuerySafran = ""; //column timecreated is flawed in one of the safran tables, we need a custom query

function timePeriodToSemesterInterval($timePeriod, $periodArray, $timeCreatedPrefix = ""){
    $from = $periodArray[$timePeriod]["from"]->format("U");
    $to = $periodArray[$timePeriod]["to"]->format("U");
    
    $addTimePeriodToQuery = " AND " .
        $timeCreatedPrefix . "timecreated > " . $from . " AND " .
        $timeCreatedPrefix . "timecreated < " . $to . "";

    return $addTimePeriodToQuery;
}

if ($timePeriod !== "none") {
    $addTimePeriodToQuery = timePeriodToSemesterInterval($timePeriod, $periodArray);
    $addTimePeriodToQuerySafran = timePeriodToSemesterInterval($timePeriod, $periodArray, "sqa.");
}



# Convert time in human readbale format
function timeUtoHMS($timeInU){
    $hours = $timeInU / 3600;
    $hours = floor($hours);
    $minutes = ($timeInU - ($hours * 3600)) / 60;
    $minutes = floor($minutes);
    $seconds = ($timeInU - (($hours * 3600) + ($minutes * 60)));

    $timeSpentFormatted = $hours . " h " . $minutes . " m " . $seconds . " s";

    return $timeSpentFormatted;
}



# SQL queries
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
    id,
    timecreated,
    component,
    contextid
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? $addTimePeriodToQuery AND
    timecreated > 1000
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
    id,
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
    AVG(qua.timefinish - qua.timestart) AS avgTime,
    MAX(qua.attempt) AS attempts,
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
FROM {quiz} AS qu
JOIN {quiz_grades} AS qug
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

//cast column timecreated to int ?

$query_safran_fa_la = "
SELECT 
MIN(sqa.timecreated) AS first_access,
MAX(sqa.timecreated) AS last_access 
FROM {safran_q_attempt} AS sqa,
    {safran_question} AS sq,
    {safran} AS s
WHERE 
sqa.userid = ? AND
sqa.questionid = sq.id AND
sq.course = s.id AND
s.course = ?
";
// FIXME $addTimePeriodToQuerySafran

$query_safran_access = "
SELECT 
    sqa.id,
    sqa.timecreated
FROM {safran_q_attempt} AS sqa,
    {safran_question} AS sq,
    {safran} AS s
WHERE 
sqa.userid = ? AND
sqa.questionid = sq.id AND
sq.course = s.id AND
s.course = ?
ORDER BY sqa.timecreated ASC
";
// FIXME: $addTimePeriodToQuerySafran


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




// removed "IFNULL(name, 'NoName')"
// IFNULL is not available on target platform (postgres), swapped it with a case statement
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





$lastRecord = 0;
$sessions = 0;
$timeSpent = 0;

$activeDays = 0;
$lastDay = 0;


function get_date_7days_ago(){
    $today = new DateTimeImmutable("now", new DateTimeZone('Europe/Berlin'));
    $sevenDaysAgo = $today->sub(new DateInterval('P7D'));
    return $sevenDaysAgo->format("U");
}

$activitySequenceLast7Days = [];




$recordsActivityFaLa = array();
$recordsActivityAccess = array();
$recordsCourseAccess;

//$DB->set_debug(true);

$dbman = $DB->get_manager();


// fetch common records of activites (access times) from DB

$start_time = microtime(true);       // measuring time of db query

foreach ($activity_array as $activityName => $activityArr) {

    $convertComponent = "mod_" . explode("_", $activityName)[0];    // prefix 'mod_' is relevant to entries in logstore_standard_log
    if ($convertComponent === "mod_course") {
        // queries for the whole course 
        try {

            $transaction = $DB->start_delegated_transaction();
            $recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_course_fa_la, array($course_id, $user_id));
            $recordsCourseAccess = $DB->get_records_sql($query_course_access, array($course_id, $user_id));
            $transaction->allow_commit();
        } catch (Exception $e) {
            $dubug .= "DB error" . print_r($e);
            $transaction->rollback($e);
        }
        continue;
    }
    // queries for activities with common attributes
    if ($dbman->table_exists(explode("_", $activityName)[0])) {
        try {
            $transaction = $DB->start_delegated_transaction();
            $recordsActivityFaLa[$activityName] = $DB->get_record_sql($query_activity_fa_la, array($course_id, $user_id, $convertComponent));
            $recordsActivityAccess[$activityName] = $DB->get_records_sql($query_activity_access, array($course_id, $user_id, $convertComponent));
            $transaction->allow_commit();
        } catch (Exception $e) {
            $dubug .= "DB error" . print_r($e);
            $transaction->rollback($e);
        }
    }
    // ladtopics is special
    if ($activityName == "format_ladtopics_activity") {
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


try {

    $records_course_sections = $DB->get_records_sql($query_course_sections, array($course_id));
    $records_course_modules_completion = $DB->get_records_sql($query_course_modules_completion, array($course_id, $user_id));

    $records_quiz_scores = $DB->get_records_sql($query_quiz_scores, array($course_id, $user_id));
    $records_quiz_attempts = $DB->get_records_sql($query_quiz_attempts, array($course_id, $user_id));

    if ($dbman->table_exists("safran_q_attempt")) {
        $records_safran_fa_la = $DB->get_record_sql($query_safran_fa_la, array((int) $user_id, (int) $course_id));
        $records_safran_access = $DB->get_records_sql($query_safran_access, array((int) $user_id, (int) $course_id));
    }

    $records_format_ladtopics_fa_la_access = $DB->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, "format_ladtopics"));

    
} catch (Exception $e) {
    $dubug .= "DB error" . print_r($e);
    $transaction->rollback($e);
}


// echo print_r($records_course_sections);
// echo "<br>";
// echo print_r($records_course_modules_completion);
//echo print_r($records_safran_fa_la);
//print_r($recordsActivityFaLa);

$elapsedTime = microtime(true) - $start_time;





// uncommon records insert start
if (!empty($records_subs)) {
    $tmparr = array();

    foreach ($records_subs as $singleRecord) {
        $tmparr[] = number_format($singleRecord->scores, 0);
    }
    $activity_array["assign_activity"]["submissions_per_instance"] = count($records_subs);
    $activity_array["assign_activity"]["scores"] = $tmparr;
}

if (!empty($records_quiz_attempts)) {
    try {
        $tmparr = array();
        $tmparr2 = array();
        $tmp = 0;
        $tmp2 = 0;

        foreach ($records_quiz_attempts as $singleRecord) {
            $tmp += $singleRecord->attempts;
            if ($singleRecord->attempts != 1) $tmp2++;
            $tmparr[] = $singleRecord->name . ": " . $singleRecord->attempts;
            $tmparr2[] = $singleRecord->name . ": " . timeUtoHMS(floor($singleRecord->avgtime));
            //print_r($singleRecord);
        }
        $activity_array["quiz_activity"]["count_attempts"] = $tmp;
        $activity_array["quiz_activity"]["count_unique_quizes"] = count($records_quiz_attempts);
        $activity_array["quiz_activity"]["count_unique_repeated_quizes"] = $tmp2;
        $activity_array["quiz_activity"]["avg_attempt_time_per_task"] = $tmparr2;
        $activity_array["quiz_activity"]["count_attempts_per_quiz"] = $tmparr;
    } catch (Exception $e) {
        $dubug .= print_r($e);
    }
}

if (!empty($records_course_sections)) {
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

if (!empty($records_quiz_scores)) {
    $tmparr = array();
    $tmp = 0;

    //print_r($records_quiz_attempts);
    foreach ($records_quiz_scores as $singleRecord) {
        $tmparr[] = $singleRecord->name . ": " . number_format($singleRecord->grade, 2);
    }
    $activity_array["quiz_activity"]["scores"] = $tmparr;
}

if (!empty($records_safran_fa_la)) {
    $activity_array["safran_activity"]["first_access"] = Date("d.m.y, H:i:s", $records_safran_fa_la->first_access);
    $activity_array["safran_activity"]["first_access_utc"] = (int)$records_safran_fa_la->first_access;
    $activity_array["safran_activity"]["last_access"] = Date("d.m.y, H:i:s", $records_safran_fa_la->last_access);
}

if (!empty($records_safran_access)) {

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

if (!empty($records_format_ladtopics_fa_la_access)) {
    $tmparr = array();
    foreach ($records_format_ladtopics_fa_la_access as $singleRecord) {
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




/**
 * 
 */
function get_longpage_data(){
    global $debug, $course_id, $user_id, $DB, $addTimePeriodToQuery;
    // comments are saved in this table
    // 0 = marked text, 1 = annotation, 2 = bookmarks
    $query_longpage_posts = "
    SELECT SUM(lp.ispublic) AS sum, COUNT(lp.id) AS count
    FROM {longpage_posts} lp
    JOIN {longpage} l ON lp.longpageid = l.id
    WHERE l.course = :course_id AND lp.creatorid = :user_id $addTimePeriodToQuery
    ;";

    $query_longpage_post_reading = "
    SELECT COUNT(lpr.id) AS count
    FROM {longpage_post_readings} lpr
    JOIN {longpage} l ON lpr.postid = l.id
    WHERE l.course = :course_id AND lpr.userid = :user_id $addTimePeriodToQuery
    ;";

    $query_longpage_annotations = "
    SELECT la.id, type, ispublic, longpageid
    FROM {longpage_annotations} la 
    JOIN {longpage} l ON la.longpageid = l.id
    WHERE l.course = :course_id AND la.creatorid = :user_id  $addTimePeriodToQuery
    ;";

    // TODO: add $addTimePeriodToQuery
    $query_longpage_instances = "
    SELECT id, name
    FROM {longpage}
    WHERE course = :course_id 
    ;";

    // TODO: add $addTimePeriodToQuery
    $query_longpage_reading_progress = "
    SELECT COUNT(DISTINCT section) AS count, sectioncount, longpageid
    FROM {longpage_reading_progress}
    WHERE course = :course_id AND userid = :user_id 
    GROUP BY longpageid, sectioncount
    ;";

    try{
        if ($DB->count_records("longpage") > 0) {
            // TODO: post creation
            //$records_longpage_posts = $DB->get_records_sql($query_longpage_posts, array('course_id'=>$course_id, 'user_id'=>$user_id));
            // TODO: post reading
            //$records_longpage_post_readings = $DB->get_records_sql($query_longpage_post_readings, array('course_id' => $course_id, 'user_id' => $user_id));
            $records_longpage_annotations = $DB->get_records_sql($query_longpage_annotations, array('course_id'=>$course_id, 'user_id'=>$user_id));
            $records_longpage_reading_progress = $DB->get_records_sql($query_longpage_reading_progress, array('course_id'=>$course_id, 'user_id'=>$user_id));
            $records_longpage_instances = $DB->get_records_sql($query_longpage_instances, array('course_id' => $course_id));
        }
    } catch (Exception $e) {
        $debug .= "DB error" . print_r($e);
        
    }

    $countMarks = array();
    $countBookmarks = array();
    $countPublicComments = array();
    $countPrivateComments = array();
    $ratioReadText = array();

    $tmparr = array();

    //initiate array members for easier counting
    foreach ($records_longpage_instances as $singleRecord) {
        $tmparr[$singleRecord->id]["marks"] = 0;
        $tmparr[$singleRecord->id]["bookmarks"] = 0;
        $tmparr[$singleRecord->id]["publicComments"] = 0;
        $tmparr[$singleRecord->id]["privateComments"] = 0;

        $tmparr[$singleRecord->id]["title"] = "none";
        $tmparr[$singleRecord->id]["count"] = 0;
        $tmparr[$singleRecord->id]["sectionCount"] = 0;
    }

    foreach ($records_longpage_annotations as $singleRecord) {
        switch($singleRecord->type){
            case 0:
                $tmparr[$singleRecord->longpageid]["marks"] += 1;
                break;
            case 1:
                if ($singleRecord->ispublic == 1){
                    $tmparr[$singleRecord->longpageid]["publicComments"] += 1;
                } else if ($singleRecord->ispublic == 0){ 
                    $tmparr[$singleRecord->longpageid]["privateComments"] += 1;
                }
                break;
            case 2:
                $tmparr[$singleRecord->longpageid]["bookmarks"] += 1;
        }
    }

    foreach ($records_longpage_instances as $singleRecord) {
        $tmparr[$singleRecord->id]["title"] = $singleRecord->name;
    }
    foreach ($records_longpage_reading_progress as $singleRecord) {
        $tmparr[$singleRecord->longpageid]["count"] = $singleRecord->count;
        $tmparr[$singleRecord->longpageid]["sectionCount"] = $singleRecord->sectioncount;
    }
  

    foreach($tmparr as $singleRecord){
        $countMarks[] = $singleRecord["title"].": ".$singleRecord["marks"];
        $countBookmarks[] = $singleRecord["title"].": ".$singleRecord["bookmarks"];
        $countPublicComments[] = $singleRecord["title"].": ".$singleRecord["publicComments"];
        $countPrivateComments[] = $singleRecord["title"].": ".$singleRecord["privateComments"];
        if ($singleRecord["sectionCount"] != 0) {
            $ratioReadText[] = $singleRecord["title"].": ".number_format($singleRecord["count"] / $singleRecord["sectionCount"], 2)." %";
        }
    }
    
    return $tmparr;
}

$longpage_instances_data = get_longpage_data();

//echo "Longpage<br><pre>".print_r($longpage_instances_data, true)."</pre>";
    


    /*
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
        */
    
    $activity_array["longpage_activity"]["count_marks"] = $countMarks;
    $activity_array["longpage_activity"]["count_bookmarks"] = $countBookmarks;
    $activity_array["longpage_activity"]["count_public_comments"] = $countPublicComments;
    $activity_array["longpage_activity"]["count_private_comments"] = $countPrivateComments;
    $activity_array["longpage_activity"]["ratio_read_text"] = $ratioReadText;
    $activity_array["longpage_activity"]["instances"] = $longpage_instances_data;







// uncommon records insert end

//echo print_r($recordsCourseAccess);


// TODO
//insert first_access and last_access data from DB into activity_array
foreach ($recordsActivityFaLa as $activityName => $activityArr) {
    foreach ($activityArr as $dataKey => $data) {
        if ($data != 0) $activity_array[$activityName][$dataKey] = Date("d.m.y, H:i:s", $data);
    }
}

// TODO
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
        //if ($data->timecreated > get_date_7days_ago() && $data->component != "core") $activitySequenceLast7Days[] = $data->component . ":" . $data->contextid;
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





/**
 * TOPIC: Collect questionnaire data
 */
function get_questionnaire_data($DB, $course_id, $user_id, $TimePeriodToQuery){
    $query = "
    SELECT 
concat(s.id,'-',q.id,'-',resp_results.id) AS uid, 
s.id as questionnaire_id, s.title AS questionnaire_name, 
-- s.courseid, 
-- r.id as response_id, 
r.questionnaireid, 
r.submitted AS timecreated, 
-- r.complete, 
r.userid, 
q.id as question_id, 
q.surveyid, 
q.name AS question_title, 
q.type_id AS question_type, 

-- q.content AS question_text, 
qtype.typeid, qtype.type AS questiontype, -- qtype.response_table, 
-- question types
resp_results.id as resp_item, 
-- resp_results.question_id, 
-- resp_results.response_id, 
-- resp_results.id, 
-- resp_results.response_type, 
resp_results.choice_id, resp_results.response, resp_results.rankvalue

FROM 
{questionnaire_survey} s 
JOIN {questionnaire_response} r ON s.id = r.questionnaireid 
JOIN {questionnaire_question} q ON s.id = q.surveyid 
JOIN {questionnaire_question_type} qtype ON q.type_id = qtype.typeid 
-- 
JOIN (
    SELECT resp_.id , 'resp_single' as response_type, resp_.response_id, resp_.question_id, 
    resp_.choice_id, 
    -1 as rankvalue, 
    '' as response 
    FROM {questionnaire_resp_single} resp_

    UNION

    SELECT resp_.id , 'response_text' as response_type, resp_.response_id, resp_.question_id, 
    resp_.response, 
    -1 as choice_id, 
    -1 as rankvalue
    FROM {questionnaire_response_text} resp_ 

    UNION

    SELECT resp_.id , 'resp_multiple' as response_type, resp_.response_id, resp_.question_id, 
    resp_.choice_id, 
    -1 as rankvalue, 
    '' as response 
    FROM {questionnaire_resp_multiple} resp_

    UNION 

    SELECT resp_.id , 'response_bool' as response_type, resp_.response_id, resp_.question_id, 
    resp_.choice_id, 
    -1 as rankvalue, 
    '' as response 
    FROM {questionnaire_response_bool} resp_

    UNION

    SELECT resp_.id , 'response_date' as response_type, resp_.response_id, resp_.question_id, 
    resp_.response, 
    -1 as choice_id, 
    -1 as rankvalue
    FROM {questionnaire_response_date} resp_ 

    UNION 

    SELECT resp_.id , 'response_other' as response_type, resp_.response_id, resp_.question_id, 
    resp_.response, 
    -1 as choice_id, 
    -1 as rankvalue
    FROM {questionnaire_response_other} resp_ 

    UNION

    SELECT resp_.id , 'response_rank' as response_type, resp_.response_id, resp_.question_id, 
    resp_.choice_id, 
    resp_.rankvalue, 
    '' as response
    FROM {questionnaire_response_rank} resp_ 

) resp_results ON  
r.id = resp_results.response_id AND   
q.id = resp_results.question_id AND
qtype.response_table = resp_results.response_type
-- 
WHERE s.courseid = :course_id AND r.userid = :user_id AND r.complete = 'y' 
    ;
    ";
    // -- $TimePeriodToQuery
    $res = $DB->get_records_sql($query, array('course_id' => $course_id, 'user_id' => $user_id));
    return $res;
}


/**
 * Transforms array list of questionnair responses into a nested assoc. array structured by questionnaire, question, and response items
 */
function transform_questionnaire_data($data){
    $qi = [];
    foreach($data as $item) {
        $item = (array)$item;
        $item_result = $item;
        if(!$qi['questionnaire-'.$item['questionnaire_id']]){
            $qi['questionnaire-'.$item['questionnaire_id']]['questionnaire_id'] = $item_result['questionnaire_id'];
            $qi['questionnaire-'.$item['questionnaire_id']]['questionnaire_name'] = $item_result['questionnaire_name'];
            $qi['questionnaire-'.$item['questionnaire_id']]['questions'] = [];
        }
        if(! $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]){
            $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_id'] = $item_result['question_id'];
            $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_title'] = $item_result['question_title'];
            $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_type_id'] = $item_result['question_type'];
            $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_type_name'] = $item_result['questiontype'];
            $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['items'] = [];
        }
        unset($item_result['uid']);
        unset($item_result['userid']);
        unset($item_result['questionnaire_id']);
        unset($item_result['questionnaireid']);
        unset($item_result['question_id']);
        unset($item_result['questionnaire_name']);
        unset($item_result['surveyid']);
        unset($item_result['typeid']);
        unset($item_result['questiontype']);
        unset($item_result['question_type']);
        unset($item_result['question_title']);
        
        $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['items']['item-'.$item['resp_item']] = $item_result;
        
    }
    return $qi;
}

//echo "<pre>".print_r($qi, true)."</pre>";
$questionnaire_data = get_questionnaire_data($DB, $course_id, $user_id, $TimePeriodToQuery);
$activity_array["questionnaire"] = transform_questionnaire_data($questionnaire_data);




/**
 * TOPIC: course_activity
 */


/**
 * get_course_activities: calculates and returns array of: 
 * - number of sessions, 
 * - total time spent 
 * - ratio of active days for the whole course
 * - collect activity of last 7 days ($activitySequenceLast7Days[])
 */
function get_course_activities($recordsCourseAccess, $session_timeout){
    $number_of_sessions = 0;
    $time_spent = 0;
    $active_days = 0;
    $activity_span = 0;
    $activity_sequence_last_7_days = [];
    $last_record_time = 0;
    $last_day = 0;
    
    foreach ($recordsCourseAccess as $singleRecord) {
        // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
        if ($singleRecord->timecreated < 1000){
            continue;
        } 
        if ((int)Date("z", $singleRecord->timecreated) != (int)$last_day){
            $active_days++;
        }
        if ($singleRecord->timecreated > get_date_7days_ago() && $singleRecord->component != "core"){
            $activity_sequence_last_7_days[] = $singleRecord->component . ":" . $singleRecord->contextid;
        }
        // time difference between 2 events is larger than $session_timeout ? must be a new session
        if (($last_record_time + $session_timeout) < $singleRecord->timecreated) {
            $number_of_sessions++;
            #$time_spent += $singleRecord->timecreated - $last_record_time;
            #$last_record_time = $singleRecord->timecreated;
        } else {
            /**
             * 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
             * however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
             * TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
             * logged) and add that to the calculation
             */
            $time_spent += $singleRecord->timecreated - $last_record_time;
        }
        $last_record_time = $singleRecord->timecreated;
        $last_day = Date("z", $last_record_time);
    }
    $recordsCourseAccess_arr = json_decode(json_encode($recordsCourseAccess), true);
    $first_day =  Date("z", reset($recordsCourseAccess_arr)['timecreated']);
    $last_day =  Date("z", end($recordsCourseAccess_arr)['timecreated']);
    # consider German winter semester (October - April) and summer semester (April - September)
    $activity_span = $first_day < $last_day ? $last_day - $first_day : (365 - $first_day) + $last_day; 
    return [$number_of_sessions, $time_spent, $active_days, $activity_span, $activity_sequence_last_7_days];
}

/**
 * Determine the timestamp and date of the first and last course access
 */
function get_course_access_dates($DB, $query_course_fa_la, $course_id, $user_id){
    $course_activity_access_res = $DB->get_record_sql($query_course_fa_la, array($course_id, $user_id));
    $first_access = (int)$course_activity_access_res->first_access ? $course_activity_access_res->first_access : null;
    $first_access_date = $course_activity_access_res->first_access ? Date("d.m.y, H:i:s", $course_activity_access_res->first_access) : null;
    $last_access = (int)$course_activity_access_res->last_access ? $course_activity_access_res->last_access : null;
    $last_access_date = $course_activity_access_res->last_access ? Date("d.m.y, H:i:s", $course_activity_access_res->last_access) : null;
    return [(int)$first_access, $first_access_date, (int)$last_access, $last_access_date];
}

/**
 * Determine how often a course-related goal has been changed be the user
 */
function get_goal_changes($DB, $course_id, $user_id, $TimePeriodToQuery){
    $query = "
    SELECT
    count(*) as count
    from {logstore_standard_log}
    WHERE 
    userid = ? AND
    courseid = ? AND
    component='format_ladtopics' AND 
    action='change_goal' $TimePeriodToQuery
    ;
    ";
    $res = $DB->get_record_sql($query, array($course_id, $user_id));
    return (int)$res->count;
}



# Assemble results for course-related activities
$activity_array["api_path"] = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$activity_array["execution_time_utc"] = (int)microtime(true);
$activity_array["execution_time"] = Date("d.m.y, H:i:s", microtime(true));
$activity_array["execution_duration"] = $elapsedTime;
    
$activity_array["user"]["user_id"] = (int)$user_id;
$activity_array["user"]["course_id"] = (int)$course_id;
$activity_array["user"]["semester"] = $timePeriod;
$activity_array["user"]["semester_from"] = $periodArray[$timePeriod]['from'];
$activity_array["user"]["semester_to"] = $periodArray[$timePeriod]['to'];

[$first_access, $first_access_date, $last_access, $last_access_date] = get_course_access_dates($DB, $query_course_fa_la, $course_id, $user_id);
$activity_array["course_activity"]["first_access"] = $first_access;
$activity_array["course_activity"]["first_access_date"] = $first_access_date;
$activity_array["course_activity"]["last_access"] = $last_access;
$activity_array["course_activity"]["last_access_date"] = $last_access_date;

[$number_of_sessions, $time_spent, $active_days, $activity_span, $activity_sequence_last_7_days] = get_course_activities($recordsCourseAccess, $session_timeout);
$activity_array["course_activity"]["number_of_sessions"] = (int)$number_of_sessions;
$activity_array["course_activity"]["mean_session_length"] = "xxx";
$activity_array["course_activity"]["sd_session_length"] = "xxx";
$activity_array["course_activity"]["total_time_spent"] = $time_spent;
$activity_array["course_activity"]["total_time_spent_hms"] = Date("H:i:s", $time_spent);
$activity_array["course_activity"]["active_days"] = $active_days;
$activity_array["course_activity"]["activity_span"] = $activity_span;
$activity_array["course_activity"]["course_overview_page_visits"] = "xxx";
$activity_array["course_activity"]["goal_changes"] = get_goal_changes($DB, $course_id, $user_id, $TimePeriodToQuery);
$activity_array["course_activity"]["goal_selected"] = "xxx";
$activity_array["course_activity"]["activity_sequence_last7days"] = $activity_sequence_last_7_days;
$activity_array["course_activity"]["course_unit_completion"] = "xxx";
$activity_array["course_activity"]["course_unit_success"] = "xxx";


# OUTPUT
$output_format = 'json'; # default
$accepted_output_formats = ['json', 'html', 'debug'];

if (isset($_REQUEST["format"]) && in_array($_REQUEST["format"], $accepted_output_formats)) {
    $output_format = $_REQUEST["format"];
} else{
    die;
}

if($output_format == 'json'){
    header('Content-Type: application/json; charset=utf-8');
    print_r(json_encode($activity_array));
}

if($output_format == 'html'){
    echo "<div>ElapsedTime(DBfetch): " . number_format($elapsedTime, 10) . " us</div>";
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
}




// END

/*

semester
userid 			==== unique user id

first_enrollment	==== unix timestamp (more easy for calculations)
first_enrollment_date 	==== unix timestamp converted to human readable date
last_enrollment		==== see above
last_enrollment_date	==== see above
enrollment_span		==== days between first and last login. Amount sometime more than half a year since the platform was not closed
active_days		==== days with any user activity
number_of_sessions
course_overview_page_visits
mean_session_length
sd_session_length

srl_monitoring
srl_planning
srl_reflections
srl_goal_changes
srl_goal_last_change

page_total_views	==== long page activities 
page_KE1_views
page_KE2_views
page_KE3_views
page_KE4_views
page_total_scroll
page_KE1_scroll
page_KE2_scroll
page_KE3_scroll
page_KE4_scroll
count_reading_sessions
total_reading_session_length
mean_reasing_session_length
sd_reading_session_length


quiz_total_viewed	==================> quiz includes assessments that are _no_ self assessments (e.g. multiple choice)
quiz_KE1_viewed
quiz_KE2_viewed
quiz_KE3_viewed
quiz_KE4_viewed
quiz_total_submitted
quiz_KE1_submitted
quiz_KE2_submitted
quiz_KE3_submitted
quiz_KE4_submitted
quiz_total_submitted_unique
quiz_KE1_submitted_unique
quiz_KE2_submitted_unique
quiz_KE3_submitted_unique
quiz_KE4_submitted_unique
quiz_total_repetitions
quiz_KE1_repetitions
quiz_KE2_repetitions
quiz_KE3_repetitions
quiz_KE4_repetitions
quiz_total_mean_score
quiz_KE1_mean_score
quiz_KE2_mean_score
quiz_KE3_mean_score
quiz_KE4_mean_score

saq_total_viewed 	=======> saq = self-assessment implemented with the mod_quiz plug before ws2022/23
saq_KE1_viewed
saq_KE2_viewed
saq_KE3_viewed
saq_KE4_viewed
saq_total_submitted
saq_KE1_submitted
saq_KE2_submitted
saq_KE3_submitted
saq_KE4_submitted
saq_total_submitted_unique
saq_KE1_submitted_unique
saq_KE2_submitted_unique
saq_KE3_submitted_unique
saq_KE4_submitted_unique
saq_total_repetitions
saq_KE1_repetitions
saq_KE2_repetitions
saq_KE3_repetitions
saq_KE4_repetitions
saq_total_mean_score
saq_KE1_mean_score
saq_KE2_mean_score
saq_KE3_mean_score
saq_KE4_mean_score

sa_total_unique_task_views =====> sa = SAFRAN data, available since ws2022/23
sa_total_unique_task_submissions
sa_total_task_views
sa_KE1_task_views
sa_KE2_task_views
sa_KE3_task_views
sa_KE4_task_views
sa_total_submissions
sa_KE1_submissions
sa_KE2_submissions
sa_KE3_submissions
sa_KE4_submissions
sa_total_repetitions
sa_KE1_repetitions
sa_KE2_repetitions
sa_KE3_repetitions
sa_KE4_repetitions
sa_total_mean_score
sa_KE1_mean_score
sa_KE2_mean_score
sa_KE3_mean_score
sa_KE4_mean_score

assignments_first_submission 	==== assignments are submission task (German: Einsendeaufgaben)
assignments_total_submitted
assignments_KE1_submitted
assignments_KE2_submitted
assignments_KE3_submitted
assignments_KE4_submitted
assignments_mean_rel_grades
assignments_KE1_mean_rel_grades
assignments_KE2_mean_rel_grades
assignments_KE3_mean_rel_grades
assignments_KE4_mean_rel_grades

 */

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


// foreach ($activity_array as $activityName => $activityArr) {
//     $queries_activites[$activityName];
// }

// $year = $today->format("y");
// echo print_r("today " . $today->format("y-m-d") . " year " . $year);
// $sumSem = new DateTime$year . '-03-01', new DateTimeZone('Europe/Berlin'));
// echo $sumSem->format(" y-m-d");
// $winSem = new DateTimeImmutable($year . '-09-01', new DateTimeZone('Europe/Berlin'));
// echo $winSem->format(" y-m-d ");


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