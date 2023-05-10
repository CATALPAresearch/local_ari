<?php

require('../../config.php');
require_once('lib.php');
require_login();

$systemContent = context_system::instance();
require_capability('moodle/analytics:managemodels', $systemContent);


global $DB;

$course_id = $_REQUEST["cID"];

$query_UserID = "
SELECT DISTINCT
    userid,
    users.username
FROM {logstore_standard_log}
LEFT JOIN {user} as users
    ON users.id = userid
WHERE
    courseid = ?
ORDER BY userid ASC";

// used for debug and development
// $query_UserID = "
// SELECT DISTINCT
//     userid
// FROM {logstore_standard_log}
// WHERE
//     courseid = ?
// ORDER BY userid ASC";

$records_UserIDs = $DB->get_records_sql($query_UserID, array($course_id));

echo json_encode($records_UserIDs);

?>