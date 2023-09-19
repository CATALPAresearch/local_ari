<?php

require('../../config.php');
require_once('lib.php');
require_login();


/**
 * LearnerModel
 * 
 * TODO
 * - @course total progress and total rel scores
 * - course-section-wise metrics
 * 
 * 
 * LATER TODO
 * - need description of the LM in German and english
 * - semantic layer: Not all provided resources and activties are relevant for learning. Example quizzes, syllabus, and other resources with a more organisational purpus need to be excluded from the learner model.
 * - distinguish productive and receptive LM elements to filter them at/after the request
 */
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

        self::$activity_array["api_path"] = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        self::$activity_array["execution_time_utc"] = (int)microtime(true);
        self::$activity_array["execution_time"] = Date("d.m.y, H:i:s", microtime(true));
        self::$activity_array["execution_duration"] = $this->elapsedTime;
            
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

        $lml = new LearnerModelLongpage();
        $lml->build_model();
        $lma = new LearnerModelAssignment();
        $lma->build_model();
        $lmq = new LearnerModelQuiz();
        $lmq->build_model();
        $lmquest = new LearnerModelQuestionnaire();
        $lmquest->build_model();
        $lms = new LearnerModelSafran();
        $lms->build_model();
        $lmh = new LearnerModelHypervideo();
        $lmh->build_model();
        $lmserial = new LearnerModelSerial();
        $lmserial->build_model();
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

        $query_course_fa_la = "
            SELECT 
                MIN(timecreated) AS first_access,
                MAX(timecreated) AS last_access
            FROM {logstore_standard_log}
            WHERE 
                courseid = ? AND
                userid = ? AND
                timecreated > 1000 $this->addTimePeriodToQuery $component     
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
                contextinstanceid
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
        
        $url = new moodle_url('/mod/'. explode('_', $res->component)[1] .'/view.php', array('id' => $res->contextinstanceid));
        
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
        $recordsCourseAccess_arr = json_decode(json_encode($recordsCourseAccess), true);
        $first_day =  Date("z", reset($recordsCourseAccess_arr)['timecreated']);
        $last_day =  Date("z", end($recordsCourseAccess_arr)['timecreated']);
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

class LearnerModelUniversityData extends LearnerModel{
    
    function build_model(){
        parent::$activity_array['course_enrollments'] = $this->getEnrollmentData();
        // TODO
        // - sozio demografische Angaben
        // - studiengänge
        // - Studienleistungen
        
    }

    function getEnrollmentData(){
        // TODO add further fatures of student enrollment. See EDM'22 Paper.
        // initial data structure
        $arr = [
            "total_enrollments" => 0,
            "total_unique_enrollments" => 0,
            "repeated_courses" => 0,
            "enrolled_courses" => [],
        ];

        // aggregated enrollment information
        $query="
            SELECT
                COUNT(e.id) as total_enrollments,
                COUNT(DISTINCT e.enrolled_course_id) as total_unique_courses,
                (SELECT COUNT(ee.id) FROM {ari_user_enrollments} ee JOIN {user} uu ON uu.username=e.username WHERE uu.id=u.id AND ee.enrollment_repeated > 0 ) as repeated_courses
            FROM {ari_user_enrollments} e 
            JOIN {user} u ON u.username=e.username 
            WHERE 
                u.id=:user_id
            ";
        $res = $GLOBALS["DB"]->get_record_sql($query, array('user_id'=>parent::$user_id));
        // echo '<pre>'.print_r($res, true).'</pre>';
        $arr['total_enrollments'] = (int)$res->total_enrollments;
        $arr['total_unique_enrollments'] = (int)$res->total_unique_courses;
        $arr['repeated_courses'] = (int)$res->repeated_courses;

        // list of enrolled courses
        $query = "
            SELECT 
                DISTINCT e.enrolled_course_id
            FROM {ari_user_enrollments} e 
            JOIN {user} u ON u.username=e.username 
            WHERE 
                u.id=:user_id
        ";
        $res = $GLOBALS["DB"]->get_records_sql($query, array('user_id'=>parent::$user_id));
        foreach($res as $enrollment => $val){
            array_push($arr["enrolled_courses"], $val->enrolled_course_id);
        }

        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';
        return $arr;
    }

    
}



class LearnerModelLongpage extends LearnerModel{
    
    
    function build_model(){
        // return if mod_longpage is not installed
        if(core_plugin_manager::instance()->get_plugins_of_type('mod')['longpage']->name != 'longpage'){
            return;
        }
        $this->get_default_entries('mod_longpage');
         
        [
            $longpage_instances_data, 
            $countMarks, 
            $countBookmarks, 
            $countPublicComments, 
            $countPrivateComments, 
            $ratioReadText,
            $countSections,
            ] = $this->get_longpage_data();
            
            parent::$activity_array["mod_longpage"]["count_marks"] = $countMarks;
            parent::$activity_array["mod_longpage"]["count_bookmarks"] = $countBookmarks;
            parent::$activity_array["mod_longpage"]["count_public_comments"] = $countPublicComments;
            parent::$activity_array["mod_longpage"]["count_private_comments"] = $countPrivateComments;
            parent::$activity_array["mod_longpage"]["count_opened_quizzes"] = "xxx";
            parent::$activity_array["mod_longpage"]["number_of_sections"] = $countSections;
            parent::$activity_array["mod_longpage"]["ratio_read_text"] = $ratioReadText;
            parent::$activity_array["mod_longpage"]["instances"] = $longpage_instances_data;
            
    }

    function xxx(){
        $query = "SELECT DISTINCT 
                m.name activity,
                l.id activity_id,
                cm.id module_id,
                cm.section,
                COUNT(DISTINCT lrp.section) complete,
                AVG(lrp.sectioncount) count,
                '0' AS max_score,
                '0' AS achieved_score,
                MAX(lrp.timemodified) AS submission_time,
                '0' AS grading_time
                FROM {longpage} l
                JOIN {longpage_reading_progress} lrp ON l.id = lrp.longpageid
                RIGHT JOIN {course_modules} cm ON l.id = cm.instance
                RIGHT JOIN {modules} m ON m.id = cm.module 
                WHERE 
                l.course = :courseid AND
                lrp.userid= :userid AND 
                m.name = 'longpage'
                Group by m.name, l.id, cm.id, cm.section 
        ";
    }

    
    /**
     * 
     */
    function get_longpage_data(){
        $addTimePeriodToQuery = parent::$addTimePeriodToQuery;
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

        // $addTimePeriodToQuery
        $query_longpage_annotations = "
        SELECT la.id, type, ispublic, longpageid
        FROM {longpage_annotations} la 
        JOIN {longpage} l ON la.longpageid = l.id
        WHERE l.course = :course_id AND la.creatorid = :user_id
        ;";

        // TODO: add self::$addTimePeriodToQuery
        $query_longpage_instances = "
        SELECT id, name
        FROM {longpage}
        WHERE course = :course_id 
        ;";

        // TODO: add self::$addTimePeriodToQuery
        $query_longpage_reading_progress = "
        SELECT COUNT(DISTINCT section) AS count, sectioncount AS number_of_sections, longpageid
        FROM {longpage_reading_progress}
        WHERE course = :course_id AND userid = :user_id 
        GROUP BY longpageid, sectioncount
        ;";

        try{
            if ($GLOBALS["DB"]->count_records("longpage") > 0) {
                // TODO: post creation
                //$records_longpage_posts = $GLOBALS["DB"]->get_records_sql($query_longpage_posts, array('course_id'=>$course_id, 'user_id'=>$user_id));
                // TODO: post reading
                //$records_longpage_post_readings = $GLOBALS["DB"]->get_records_sql($query_longpage_post_readings, array('course_id' => $course_id, 'user_id' => $user_id));
                $records_longpage_annotations = $GLOBALS["DB"]->get_records_sql($query_longpage_annotations, array('course_id'=>parent::$course_id, 'user_id'=>parent::$user_id));
                $records_longpage_reading_progress = $GLOBALS["DB"]->get_records_sql($query_longpage_reading_progress, array('course_id'=>parent::$course_id, 'user_id'=>parent::$user_id));
                $records_longpage_instances = $GLOBALS["DB"]->get_records_sql($query_longpage_instances, array('course_id' => parent::$course_id));
            }
        } catch (Exception $e) {
            parent::debug("DB error" . print_r($e) . "LINE " . __LINE__);
            
        }

        $countMarks = 0;
        $countBookmarks = 0;
        $countPublicComments = 0;
        $countPrivateComments = 0;
        $countSections = 0;
        $ratioReadText = 0;

        $tmparr = array();

        //initiate array members for easier counting
        foreach ($records_longpage_instances as $singleRecord) {
            $tmparr[$singleRecord->id]["marks"] = 0;
            $tmparr[$singleRecord->id]["bookmarks"] = 0;
            $tmparr[$singleRecord->id]["publicComments"] = 0;
            $tmparr[$singleRecord->id]["privateComments"] = 0;

            $tmparr[$singleRecord->id]["title"] = "none";
            $tmparr[$singleRecord->id]["count_sections"] = 0;
            $tmparr[$singleRecord->id]["number_of_sections"] = 0;
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
            $tmparr[$singleRecord->longpageid]["count_sections"] = (int)$singleRecord->count;
            $tmparr[$singleRecord->longpageid]["number_of_sections"] = (int)$singleRecord->number_of_sections;
        }
    
        foreach($tmparr as $singleRecord){
            $countMarks += $singleRecord["marks"];
            $countBookmarks += $singleRecord["bookmarks"];
            $countPublicComments += $singleRecord["publicComments"];
            $countPrivateComments += $singleRecord["privateComments"];
            $countSections += $singleRecord["number_of_sections"];
            if ($singleRecord["count_sections"] != 0) {
                $ratioReadText = $singleRecord["count_sections"] / $singleRecord["number_of_sections"];
            }
        }
        
        return [$tmparr, $countMarks, $countBookmarks, $countPublicComments, $countPrivateComments, $ratioReadText, $countSections];
    }
}






/**
 * Collect questionnaire data to create the respective section of the learner model
 */
class LearnerModelQuestionnaire extends LearnerModel{
    
    function build_model(){
        //$this->get_default_entries('mod_questionnaire');
        parent::$activity_array["mod_questionnaire"] = $this->get_questionnaire_data();
    }

    function get_questionnaire_data(){
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
        $res = $GLOBALS["DB"]->get_records_sql($query, array('course_id' => parent::$course_id, 'user_id' => parent::$user_id));
        return $this->transform_questionnaire_data($res);
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
}






/**
 * Collect course activity data for the learner model
 */
class LearnerModelCourse extends LearnerModel{
    
    function build_model(){
        // Assemble results for course-related activities
        $this->get_default_entries('');
        
        parent::$activity_array["course"]["course_overview_page_visits"] = "xxx";
        parent::$activity_array["course"]["goal_changes"] = $this->get_goal_changes();
        parent::$activity_array["course"]["goal_selected"] = "xxx";
        parent::$activity_array["course"]["relative_progress"] = round((( parent::$activity_array['mod_assign']['rel_submissions'] + parent::$activity_array['mod_quiz']['rel_quizes']) / 2) * 100, 1);
        parent::$activity_array["course"]["relative_success"] = round((( parent::$activity_array['mod_assign']['mean_relative_score'] + parent::$activity_array['mod_quiz']['mean_relative_score']) / 2) * 100, 1);
    }


    /**
     * Determine how often a course-related goal has been changed be the user
     */
    function get_goal_changes(){
        $addTimePeriodToQuery = parent::$addTimePeriodToQuery;
        $query = "
        SELECT
        count(*) as count
        from {logstore_standard_log}
        WHERE 
        userid = ? AND
        courseid = ? AND
        component='format_ladtopics' AND 
        action='change_goal' $addTimePeriodToQuery
        ;
        ";
        $res = $GLOBALS["DB"]->get_record_sql($query, array(parent::$course_id, parent::$user_id));
        return (int)$res->count;
    }

    // TODO
    function get_course_completion(){
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
        $records_course_sections = $GLOBALS["DB"]->get_records_sql($query_course_sections, array(parent::$course_id));
        $records_course_modules_completion = $GLOBALS["DB"]->get_records_sql($query_course_modules_completion, array(parent::$course_id, parent::$user_id));

    }

}

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
                        asub.timemodified > :period_start AND
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
                $arr["first_submission"] = $item->submission_time;
            } else if($arr["first_submission"] > $item->submission_time){
                $arr["first_submission"] = $item->submission_time;
            }
            $arr["total_submissions"]++;
            $arr["rel_submissions"] = $arr["total_submissions"] / $item->number_of_assignments; # FIXME
            $arr["achieved_scores"] += $item->achieved_score;
            $arr["max_scores"] += $item->max_score;
            
            // per section
            if($arr["sections"]["section-" . $item->section] == null){
                $arr["sections"]["section-" . $item->section] = [
                    "title" => $item->section_title,
                    "first_submission" => $item->submission_time,
                    "total_submissions" => 0,
                    "rel_submissions" => 0,
                    "max_scores" => 0,
                    "achieved_scores" => 0,
                    "mean_relative_score" => 0,
                ];
            }
            if($arr["sections"]["section" . $item->section]["first_submission"] > $item->submission_time){
                $arr["sections"]["section" . $item->section]["first_submission"] = $item->submission_time;
            }
            $arr["sections"]["section-" . $item->section]["total_submissions"]++;
            $arr["sections"]["section-" . $item->section]["rel_submissions"] = $arr["total_submissions"] / $item->number_of_assignments; # FIXME
            $arr["sections"]["section-" . $item->section]["achieved_scores"] += $item->achieved_score;
            $arr["sections"]["section-" . $item->section]["max_scores"] += $item->max_score;
            
        }
        if($arr["max_scores"] >0){
            $arr["mean_relative_score"] = $arr["achieved_scores"] / $arr["max_scores"];
            foreach($arr["sections"] as $key => $section){
                $arr["sections"][$key]["mean_relative_score"] = $section["achieved_scores"] / $section["max_scores"];
            }
        }
        // echo '<pre>'.print_r($arr, true).'</pre>';
        // echo '<pre>'.print_r($res, true).'</pre>';
        
        return $arr;
    }
}



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
     * - ?? rel_submissions
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
                    qsub.timemodified > :period_start AND
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
            } else if($arr["first_attempt"] > $item->submission_time){
                $arr["first_attempt"] = $item->submission_time;
            }
            $arr["total_performed_unique_quizes"]++;
            if($item->number_of_attempts > 1){
                $arr["total_repeated_unique_quizes"]++;
            }
            $arr["total_attempts"] += $item->number_of_attempts;
            $arr["achieved_scores"] += $item->achieved_score;
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
        if($arr["max_scores"] > 0){
            $sum_items = 0;
            $arr["mean_relative_score"] = $arr["achieved_scores"] / $arr["max_scores"];
            foreach($arr["sections"] as $key => $section){
                $sum_items += $arr["sections"][$key]["total_existing_unique_quizes"];
                $arr["sections"][$key]["mean_relative_score"] = $section["achieved_scores"] / $section["max_scores"];
            }
            $arr["rel_quizes"] = $arr["total_performed_unique_quizes"] / $sum_items;
            $arr["total_existing_unique_quizes"] = $sum_items;
        }

        //echo '<pre>'.print_r($arr, true).'</pre>';
        //echo '<pre>'.print_r($res, true).'</pre>';

        return $arr;
    }
}

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
            if($arr["sections"]["section-" . $item->section] == null){
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
                ];
            }
            if($arr["sections"]["section" . $item->section]["first_attempt"] > $item->submission_time){
                $arr["sections"]["section" . $item->section]["first_attempt"] = $item->submission_time;
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

Class LearnerModelSerial extends LearnerModel {

    function build_model(){
        // return if mod_longpage is not installed
        if(core_plugin_manager::instance()->get_plugins_of_type('format')['serial3']->name != 'serial3'){
            return;
        }

        $this->get_default_entries('format_serial3');

        //$this->get_progress_per_section();
        //parent::$activity_array['mod_hypervideo'] = array_merge(parent::$activity_array['mod_hypervideo'], $this->get_progress_per_section());


    }
    // $records_format_ladtopics_fa_la_access = $GLOBALS["DB"]->get_records_sql($query_activity_ladtopics_access, array(parent::$course_id, parent::$user_id, "format_ladtopics"));
    /*
    $query_activity_ladtopics_access = "
            SELECT 
                other
            FROM {logstore_standard_log}
            WHERE 
                courseid = ? AND
                userid = ? AND
                component = ?
            ";
    // TODO incomplete?
            if ($activityName == "format_ladtopics_activity") {
                $convertComponent = "format_ladtopics";
                //$tmparr = array();
                //$this->recordsActivityFaLa[$activityName] = $GLOBALS["DB"]->get_record_sql($query_activity_fa_la, array($course_id, $user_id, $convertComponent));
                //$this->recordsActivityAccess[$activityName] = $GLOBALS["DB"]->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, $convertComponent));
                //$tmparr = $GLOBALS["DB"]->get_records_sql($query_activity_ladtopics_access, array($course_id, $user_id, $convertComponent));

                //print_r($this->recordsActivityFaLa[$activityName]);
                //print_r($this->recordsActivityAccess[$activityName]);
            }
    
    */
}




/**
 * LearnerModelOutput
 * @param $activity_array
 * @param $elapsedTime
 */
class LearnerModelOutput{
    
    public $activity_array = [];
    public $elapsedTime = 0;

    function __construct($activity_array, $elapsedTime) {
        $this->activity_array = $activity_array;
        $this->elapsedTime = $elapsedTime;

        $output_format = $this->validate_output_format();

        switch($output_format){
            case 'json':
                $this->generate_json_output();
                break;
            case 'html':
                $this->generate_html_output();
                break;
        }
    }

    function validate_output_format(){
        $output_format = 'json'; # default
        $accepted_output_formats = ['json', 'html', 'debug'];
        
        if (isset($_REQUEST["format"]) && in_array($_REQUEST["format"], $accepted_output_formats)) {
            $output_format = $_REQUEST["format"];
        } else{
            die;
        }
        return $output_format;
    }
    
    function generate_json_output(){
        header('Content-Type: application/json; charset=utf-8');
        print_r(json_encode($this->activity_array));
    }
    
    function generate_html_output(){
        echo "<div>ElapsedTime(DBfetch): " . number_format($this->elapsedTime, 10) . " us</div>";
        // generate html from data (activity_array)
        foreach ($this->activity_array as $key1 => $activity) {
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
}








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
course?: {
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


///////////// ALTER CODE KONSTANTIN




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
//     self::$addTimePeriodToQuery
// ORDER BY timecreated ASC
// ";



// $query_course_modules = "
// SELECT 
//     count(*)
// FROM {course_modules}
// WHERE 
//     course = ? AND
//     self::$addTimePeriodToQuery
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
//     timecreated > 1000self::$addTimePeriodToQuery
// ";







//SELECT name, sequence from course_sections where course = ? ORDER BY timemodified ASC

//SELECT coursemoduleid from course_modules_completion as cmc join course_modules as cm on cmc.coursemoduleid=cm.id where userid = ? AND cm.course = ? ORDER BY added ASC






/*


// echo print_r($records_course_sections);
// echo "<br>";
// echo print_r($records_course_modules_completion);
//echo print_r($records_safran_fa_la);
//print_r($recordsActivityFaLa);



// uncommon records insert start
if (!empty($records_subs)) {
    $tmparr = array();

    foreach ($records_subs as $singleRecord) {
        $tmparr[] = number_format($singleRecord->scores, 0);
    }
    parent::$activity_array["assign_activity"]["submissions_per_instance"] = count($records_subs);
    parent::$activity_array["assign_activity"]["scores"] = $tmparr;
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
        parent::$activity_array["quiz_activity"]["count_attempts"] = $tmp;
        parent::$activity_array["quiz_activity"]["count_unique_quizes"] = count($records_quiz_attempts);
        parent::$activity_array["quiz_activity"]["count_unique_repeated_quizes"] = $tmp2;
        parent::$activity_array["quiz_activity"]["avg_attempt_time_per_task"] = $tmparr2;
        parent::$activity_array["quiz_activity"]["count_attempts_per_quiz"] = $tmparr;
    } catch (Exception $e) {
        self::debug(print_r($e));
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
    parent::$activity_array["course"]["course_unit_completion"] = $tmparr1;
    parent::$activity_array["course"]["course_unit_success"] = $tmparr2;
}

if (!empty($records_quiz_scores)) {
    $tmparr = array();
    $tmp = 0;

    //print_r($records_quiz_attempts);
    foreach ($records_quiz_scores as $singleRecord) {
        $tmparr[] = $singleRecord->name . ": " . number_format($singleRecord->grade, 2);
    }
    parent::$activity_array["quiz_activity"]["scores"] = $tmparr;
}

if (!empty($records_safran_fa_la)) {
    parent::$activity_array["safran_activity"]["first_access"] = Date("d.m.y, H:i:s", $records_safran_fa_la->first_access);
    parent::$activity_array["safran_activity"]["first_access_utc"] = (int)$records_safran_fa_la->first_access;
    parent::$activity_array["safran_activity"]["last_access"] = Date("d.m.y, H:i:s", $records_safran_fa_la->last_access);
}

if (!empty($records_safran_access)) {

    $sessionsSafran = 0;
    $timeSpentSafran = 0;
    $lastRecordSafran = 0;

    foreach ($records_safran_access as $singleRecord) {
        if ($singleRecord->timecreated < 1000) continue;    // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
        if (($lastRecordSafran + $this->session_timeout) < $singleRecord->timecreated) {     // time difference between 2 events is larger than $this->session_timeout ? must be a new session
            $sessionsSafran++;
            $timeSpentSafran += $this->assumedTimeSpent;
        } else {
            //
            // 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
            // however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
            // TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
            // logged) and add that to the calculation
             //
            $timeSpentSafran += $singleRecord->timecreated - $lastRecordSafran;
        }
        $lastRecordSafran = $singleRecord->timecreated;
        //echo $lastDay."<br>";
    }



    parent::$activity_array["safran_activity"]["number_of_sessions"] = $sessionsSafran;
    parent::$activity_array["safran_activity"]["time_spent"] = timeUToHMS($timeSpentSafran);
}

if (!empty($records_format_ladtopics_fa_la_access)) {
    $tmparr = array();
    foreach ($records_format_ladtopics_fa_la_access as $singleRecord) {
        $tmparr[] = explode(":", $singleRecord->other)[1];    // data is in format:         "{""utc"":1569919746765
    }

    sort($tmparr);

    parent::$activity_array["format_ladtopics_activity"]["first_access"] = Date("d.m.y, H:i:s", $tmparr[0]);
    parent::$activity_array["format_ladtopics_activity"]["last_access"] = Date("d.m.y, H:i:s", $tmparr[count($tmparr) - 1]);

    $lastRecordLadtopics = 0;
    $timeSpentLadtopics = 0;
    $sessionsLadtopics = 0;
    $fromInU = 0; // ???
    $toInU = 0;
    foreach ($tmparr as $singleRecord) {
        if ($singleRecord < 1000) continue;    // there are events in the DB which dont have a proper timestamp, usually somewhere below 1000 (those are system logs, not relevant to user data)
        if ($timePeriod !== "none") {
            if ($singleRecord < $fromInU || $singleRecord > $toInU) continue;
        }

        if (($lastRecordLadtopics + $this->session_timeout) < $singleRecord) {     // time difference between 2 events is larger than $this->session_timeout ? must be a new session
            $sessionsLadtopics++;
            $timeSpentLadtopics += $this->assumedTimeSpent;
        } else {
            //
            // 2 events are propably in the same session, so we count the time between them and assume this as user engagement time with course
             // however, we cant track the time if user triggers a singular event and then doesnt trigger another event within the session_timeout
             // TODO: check logstore_standard_log with courseid = 0 (thats where loggedin and loggedout events of a user are 
             // logged) and add that to the calculation
             
            $timeSpentLadtopics += $singleRecord - $lastRecordLadtopics;
        }
        $lastRecordLadtopics = $singleRecord;
    }

    parent::$activity_array["format_ladtopics_activity"]["number_of_sessions"] = $sessionsLadtopics;
    parent::$activity_array["format_ladtopics_activity"]["time_spent"] = timeUToHMS($timeSpentLadtopics);
}

*/



//////////// END ALTER CODE KONSTANTIN


// foreach ($activity_array as $activityName => $activityArr) {
//     $queries_activites[$activityName];
// }

// $year = $today->format("y");
// echo print_r("today " . $today->format("y-m-d") . " year " . $year);
// $sumSem = new DateTime$year . '-03-01', new DateTimeZone('Europe/Berlin'));
// echo $sumSem->format(" y-m-d");
// $winSem = new DateTimeImmutable($year . '-09-01', new DateTimeZone('Europe/Berlin'));
// echo $winSem->format(" y-m-d ");


// function queryGenerator($activityArray, $courseID, $userID, $component, $action,)
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
//             self::$addTimePeriodToQuery
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
//         self::$addTimePeriodToQuery
//     ";

//     return $queriesFaLa;
// };