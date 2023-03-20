<?php

require('../../config.php');
require_once('lib.php');
require_login();


global $DB;

$course_id = $_REQUEST["q"];

$query_UserID = "
SELECT DISTINCT
    userid
FROM {logstore_standard_log}
WHERE
    courseid = ?
ORDER BY userid ASC";


$records_UserIDs = $DB->get_records_sql($query_UserID, array($course_id));

echo json_encode($records_UserIDs);

?>