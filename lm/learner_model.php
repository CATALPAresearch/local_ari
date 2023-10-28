<?php

/**
 * LearnerModel
 * 
 * TODO
 * Split
 * - Safran
 * - WIP course-section-wise metrics
 * - @course total progress and total rel scores
 * 
 * 
 * LATER TODO
 * - need description of the LM in German and english
 * - semantic layer: Not all provided resources and activties are relevant for learning. Example quizzes, syllabus, and other resources with a more organisational purpus need to be excluded from the learner model.
 * - distinguish productive and receptive LM elements to filter them at/after the request
 */

require('../../../config.php');
require_once('../lib.php');
require_login();

require_once('learner_model_assignment.php');
require_once('learner_model_course.php');
require_once('learner_model_hypervideo.php');
require_once('learner_model_longpage.php');
require_once('learner_model_questionnaire.php');
require_once('learner_model_quiz.php');
require_once('learner_model_safran.php');
require_once('learner_model_serial.php');
require_once('learner_model_university.php');
require_once('output.php');

class LearnerModel{
    
    public static $activity_array = [];
    public $elapsedTime = 0;
    public static $debug_messages = [];
    public $actionview = "viewed";
    public $target = "course";
    public $session_timeout = 1800;  // 1800s = 30m
    // we use this to guess the time a user had interaction with a course within a single session when we dont have further data available
    public $assumedTimeSpent = 300; // = 300s = 5m 
    
    public static $course_id = 0;
    public static $user_id = 0;
    public $time_period_start = 0;
    public $time_period_end = 0;
    public $timePeriod;
    public static $addTimePeriodToQuery = ""; // FIXME should be replaced with $time_period_start
    public static $addTimePeriodToQuerySafran = ""; // FIXME should be replaced with $time_period_start
    
    public $periodArray;

    function __construct() {
        $this->check_permissions();
        $this->validate_http_parameters();
        $this->set_time_periods();
    }

    function init(){
        // prepare
        $this->declare_data_structure();

        // build model
        $start_time = microtime(true); // measuring time of db query

        self::$activity_array['api']["path"] = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        self::$activity_array['api']["execution_time_utc"] = (int)microtime(true);
        self::$activity_array['api']["execution_time"] = Date("d.m.y, H:i:s", microtime(true));
        self::$activity_array['api']["execution_duration"] = $this->elapsedTime;
            
        self::$activity_array["user"]["user_id"] = (int)self::$user_id;
        self::$activity_array["user"]["course_id"] = (int)self::$course_id;
        self::$activity_array["user"]["semester"] = $this->timePeriod;
        self::$activity_array["user"]["semester_from"] = $this->periodArray[$this->timePeriod]['from'];
        self::$activity_array["user"]["semester_to"] = $this->periodArray[$this->timePeriod]['to'];

        $query = "
            SELECT 
                tp.currentversionid
                -- REPLACE(u.username, 'q', '') as matrikelnumber
            FROM {user} u
            JOIN {tool_policy_acceptances} pa ON pa.userid = u.id
            JOIN {tool_policy} tp ON tp.currentversionid = pa.policyversionid
            JOIN {user_enrolments} ur ON ur.userid = u.id
            JOIN {enrol} e ON e.id = ur.enrolid
            JOIN {course} m ON e.courseid = m.id
            WHERE 
            -- u.username LIKE 'q%' AND 
            u.id=:user_id AND
            (tp.currentversionid > 0 OR tp.currentversionid=4 OR tp.currentversionid=1) AND 
            e.courseid IS NOT NULL
            ORDER BY 
            u.username
        ";
        $res = $GLOBALS["DB"]->get_records_sql($query, array("user_id" => self::$user_id));
        $accepted_policies = [];
        foreach($res as $key=>$val){
            array_push($accepted_policies, (int)$val->currentversionid);
        }
        //echo '<pre>'.print_r($res, true).'</pre>';
        
        self::$activity_array["user"]["accepted_policies"] = $accepted_policies;

        $lme = new LearnerModelUniversityData();
        $lme->build_model();
        if($GLOBALS["DB"]->get_record_sql("SELECT 1 FROM {config_plugins} WHERE plugin='longpage'")){
            $lml = new LearnerModelLongpage();
            $lml->build_model();
        }
        $lma = new LearnerModelAssignment();
        $lma->build_model();
        $lmq = new LearnerModelQuiz();
        $lmq->build_model();
        $lmquest = new LearnerModelQuestionnaire();
        $lmquest->build_model();
        if($GLOBALS["DB"]->get_record_sql("SELECT 1 FROM {config_plugins} WHERE plugin='safran'")){
            $lms = new LearnerModelSafran();
            $lms->build_model();
        }
        if($GLOBALS["DB"]->get_record_sql("SELECT 1 FROM {config_plugins} WHERE plugin='hypervideo'")){
            $lmh = new LearnerModelHypervideo();
            $lmh->build_model();
        }
        if($GLOBALS["DB"]->get_record_sql("SELECT 1 FROM {config_plugins} WHERE plugin='serial3'")){
            $lmserial = new LearnerModelSerial();
            $lmserial->build_model();
        }
        $lmc = new LearnerModelCourse();
        $lmc->build_model();
        

        self::$activity_array["debug"] = self::$debug_messages;
        $elapsedTime = microtime(true) - $start_time;

        
        // output learner model
        $lmo = new LearnerModelOutput(self::$activity_array, $elapsedTime);
    }

    function check_permissions(){
        // Ensure access only managers and teachers but also for users requesting their own data
        if(isset($_REQUEST["user_id"]) && (int)$_REQUEST["user_id"] != (int)$GLOBALS["USER"]->id){
            $systemContent = context_system::instance();
            require_capability('moodle/analytics:managemodels', $systemContent);
        }
    }

    # Load request parameters
    function validate_http_parameters(){
        if(isset($_REQUEST["user_id"])){
            self::$user_id = $_REQUEST["user_id"];
        } else{
            die;
        }
        
        if(isset($_REQUEST["course_id"])){
            self::$course_id = $_REQUEST["course_id"];
        } else{
            die;
        }
        
        if (isset($_REQUEST["period"])) {
            $this->timePeriod = $_REQUEST["period"];
        }
    }

    function declare_data_structure(){
        self::$activity_array = array("debug" => []);
    }

    function set_time_periods(){
        $this->periodArray = [
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
            'WS23' => ['from' => new DateTimeImmutable("2023-10-01"), 'to'=>new DateTimeImmutable("2024-03-31")],
            'SS23' => ['from' => new DateTimeImmutable("2023-04-01"), 'to'=>new DateTimeImmutable("2023-09-30")],
            'WS24' => ['from' => new DateTimeImmutable("2024-10-01"), 'to'=>new DateTimeImmutable("2025-03-31")],
            'SS24' => ['from' => new DateTimeImmutable("2024-04-01"), 'to'=>new DateTimeImmutable("2024-09-30")],
            'WS25' => ['from' => new DateTimeImmutable("2025-10-01"), 'to'=>new DateTimeImmutable("2026-03-31")],
            'SS25' => ['from' => new DateTimeImmutable("2025-04-01"), 'to'=>new DateTimeImmutable("2025-09-30")],
            'WS26' => ['from' => new DateTimeImmutable("2026-10-01"), 'to'=>new DateTimeImmutable("2027-03-31")],
            'SS26' => ['from' => new DateTimeImmutable("2026-04-01"), 'to'=>new DateTimeImmutable("2026-09-30")],
            'WS27' => ['from' => new DateTimeImmutable("2027-10-01"), 'to'=>new DateTimeImmutable("2028-03-31")],
            'SS27' => ['from' => new DateTimeImmutable("2027-04-01"), 'to'=>new DateTimeImmutable("2027-09-30")],
            'WS28' => ['from' => new DateTimeImmutable("2028-10-01"), 'to'=>new DateTimeImmutable("2029-03-31")],
            'SS28' => ['from' => new DateTimeImmutable("2028-04-01"), 'to'=>new DateTimeImmutable("2028-09-30")],
            'WS29' => ['from' => new DateTimeImmutable("2029-10-01"), 'to'=>new DateTimeImmutable("2030-03-31")],
            'SS29' => ['from' => new DateTimeImmutable("2029-04-01"), 'to'=>new DateTimeImmutable("2029-09-30")],
        ];
    
        # Concat string for filter queries for time ranges
        if ($this->timePeriod !== "none") {
            self::$addTimePeriodToQuery = $this->timePeriodToSemesterInterval($this->timePeriod, $this->periodArray);
            self::$addTimePeriodToQuerySafran = $this->timePeriodToSemesterInterval($this->timePeriod, $this->periodArray, "sqa.");
        }
    }
    
    function timePeriodToSemesterInterval($timePeriod, $periodArray, $timeCreatedPrefix = ""){
        $this->time_period_start = $periodArray[$timePeriod]["from"]->format("U");
        $this->time_period_end = $periodArray[$timePeriod]["to"]->format("U");

        
        $addTimePeriodToQuery = " AND " .
            $timeCreatedPrefix . "timecreated > " . $this->time_period_start . " AND " .
            $timeCreatedPrefix . "timecreated < " . $this->time_period_end . "";
    
        return $addTimePeriodToQuery;
    }

    # Convert time in human readbale format
    function timeUtoHMS($timeInU){
        $hours = $timeInU / 3600;
        $hours = floor($hours);
        $minutes = ($timeInU - ($hours * 3600)) / 60;
        $minutes = floor($minutes);
        $seconds = ($timeInU - (($hours * 3600) + ($minutes * 60)));
        $timeSpentFormatted = $hours . "h " . $minutes . "m " . $seconds . "s";
        return $timeSpentFormatted;
    }

    function get_date_7days_ago(){
        $today = new DateTimeImmutable("now", new DateTimeZone('Europe/Berlin'));
        $sevenDaysAgo = $today->sub(new DateInterval('P7D'));
        return $sevenDaysAgo->format("U");
    }

    /**
     * Assembles default entries of the learner model for a single component or the overall course
     */
    function get_default_entries($component_name){
        
        [$first_access, $last_access] = $this->get_first_last_access($component_name);
        $logs = $this->get_log_records($component_name);
        [$number_of_sessions, $time_spent, $active_days, $activity_span, $activity_sequence_last_7_days] = $this->get_activity_stats($logs);
        $last_activity = $this->get_last_activity();

        if($component_name == ""){
            $component_name = "course";
        }
        self::$activity_array[$component_name]["first_access"] = $first_access;
        self::$activity_array[$component_name]["first_access_date"] = Date("d.m.y, H:i:s", $first_access);
        self::$activity_array[$component_name]["last_access"] = $last_access;
        self::$activity_array[$component_name]["last_access_date"] = Date("d.m.y, H:i:s", $last_access);
        self::$activity_array[$component_name]["last_access_days_ago"] = (int)(new DateTime())->diff(new DateTime(Date("d.m.Y", $last_access)))->format("%a");
        self::$activity_array[$component_name]["number_of_sessions"] = (int)$number_of_sessions;
        self::$activity_array[$component_name]["mean_session_length"] = "xxx"; //(double)mean_session_length;
        self::$activity_array[$component_name]["sd_session_length"] = "xxx"; //(double)sd_session_length;
        self::$activity_array[$component_name]["total_time_spent"] = $time_spent;
        self::$activity_array[$component_name]["total_time_spent_hms"] = Date("H:i:s", $time_spent);
        self::$activity_array[$component_name]["active_days"] = $active_days;
        self::$activity_array[$component_name]["activity_span"] = $activity_span;
        self::$activity_array[$component_name]["activity_sequence_last7days"] = $activity_sequence_last_7_days;
        self::$activity_array[$component_name]["last_activity"] = $last_activity;
    }

    /**
     * Returns the UTC timestampe of the first and last access to the course respective to a given component of the course
     */
    function get_first_last_access($component = ''){

        if($component != ""){
            $component = " AND component='". $component . "'";
        }
        $addTimePeriodToQuery = self::$addTimePeriodToQuery;
        $query_course_fa_la = "
            SELECT 
                MIN(timecreated) AS first_access,
                MAX(timecreated) AS last_access
            FROM {logstore_standard_log}
            WHERE 
                courseid = ? AND
                userid = ? AND
                timecreated > 1000 $addTimePeriodToQuery $component     
            ;
        ";

        $res = $GLOBALS["DB"]->get_record_sql($query_course_fa_la, array(self::$course_id, self::$user_id));
        
        return [(int)$res->first_access, (int)$res->last_access];
    }

    /**
     * 
     */
    function get_log_records($component = ""){
        if($component != ""){
            $component = " AND component='". $component . "'";
        }
        $addTimePeriodToQuery = self::$addTimePeriodToQuery;
        $query_course_records = "
            SELECT
                id,
                timecreated,
                component,
                contextid,
                contextinstanceid
            FROM {logstore_standard_log}
            WHERE 
                courseid = :course_id AND
                userid = :user_id AND
                timecreated > 1000 $addTimePeriodToQuery $component
            ORDER BY timecreated ASC
        ";
        $res = $GLOBALS["DB"]->get_records_sql($query_course_records, array(
            'course_id' => self::$course_id, 
            'user_id' => self::$user_id
        ));
        return $res;
    }

    /**
     * 
     */
    function get_last_activity($component = ""){
        if($component != ""){
            $component = " AND component='". $component . "'";
        }
        $addTimePeriodToQuery = self::$addTimePeriodToQuery;
        $query_course_records = "
            SELECT
                contextinstanceid,
                component
            FROM {logstore_standard_log}
            WHERE 
                courseid = :course_id AND
                userid = :user_id AND
                component <> 'core' AND
                timecreated > 1000 $addTimePeriodToQuery $component
            ORDER BY timecreated DESC
            LIMIT 1
        ";
        $res = $GLOBALS["DB"]->get_record_sql($query_course_records, array(
            'course_id' => self::$course_id, 
            'user_id' => self::$user_id
        ));

        $url = '';
        if($res){
            $url = new moodle_url('/mod/'. explode('_', $res->component)[1] .'/view.php', array('id' => $res->contextinstanceid));
        }
        return (string) $url;
    }

    /**
     * 
     */
    function get_activity_stats($recordsCourseAccess){
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
            if ($singleRecord->timecreated > $this->get_date_7days_ago() && $singleRecord->component != "core"){
                $activity_sequence_last_7_days[] = $singleRecord->component . ":" . $singleRecord->contextid;
            }
            // time difference between 2 events is larger than $session_timeout ? must be a new session
            if (($last_record_time + $this->session_timeout) < $singleRecord->timecreated) {
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
        $recordsCourseAccess_arr = array_values(json_decode(json_encode($recordsCourseAccess), true));
        if(count($recordsCourseAccess_arr)>0){
            $first_day =  Date("z", $recordsCourseAccess_arr[0]['timecreated']);
            $last_day =  Date("z", end($recordsCourseAccess_arr)['timecreated']);
        } else{
            $first_day =  0;
            $last_day =  0;
        }
        
        # consider German winter semester (October - April) and summer semester (April - September)
        $activity_span = $first_day < $last_day ? $last_day - $first_day : (365 - $first_day) + $last_day; 

        return [$number_of_sessions, $time_spent, $active_days, $activity_span, $activity_sequence_last_7_days];
    }

    // Collect debug messages and store them in the array $debug_messages to become a part of the output
    public static function debug($msg){
        array_push(self::$debug_messages, $msg);
    }
}



$lm = new LearnerModel();
$lm->init();
