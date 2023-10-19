<?php

require('../../../config.php');
require_once('../lib.php');
require_login();

$systemContent = context_system::instance();
require_capability('moodle/analytics:managemodels', $systemContent);

global $DB;

if(isset($_REQUEST["course_id"])){
    $course_id = (int) $_REQUEST["course_id"];
} else{
    echo json_encode(['error' => "HTTP GET parameter 'course_id' was not set or set in wrong format."]);
}

if(is_int($course_id) && $course_id > 0){
    $query_user_ids = "
        SELECT DISTINCT
            userid,
            users.username
        FROM {logstore_standard_log}
        LEFT JOIN {user} AS users
            ON users.id = userid
        WHERE
            courseid = :course_id
        ORDER BY userid ASC
        ;
        ";

    $result = $DB->get_records_sql($query_user_ids, array('course_id' => $course_id));

    echo json_encode($result);
} else{
    echo json_encode(['error' => "HTTP GET parameter 'course_id' is not valid."]);
}
