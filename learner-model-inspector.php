<?php

require('../../config.php');
require_once('lib.php');
require_login();

$title = get_string('pluginname', 'local_ari') . ": Learner Model Inspector";
$PAGE->set_url($CFG->wwwroot . '/local/ari/learner-model-inspector.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);

$systemContent = context_system::instance();
require_capability('moodle/analytics:managemodels', $systemContent);

//$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');


echo $OUTPUT->header();

echo    "<style>
            th {border: 1px solid #dddddd;
                padding: 4px;}
            td {border: 1px solid #dddddd;
                padding: 4px;}
            .arrayInTableStyle {
                max-height: 4em;
                overflow: auto;
            }
            .activityDescription {
            }
        </style";

echo "
<strong>How the learner model is created</strong>
<ol>
    <li>...</li>
    <li>...</li>
    <li>...</li>
</ol>
";

echo "<script>
                function fetchUsers(){
                    var cID = document.getElementById('courseSelect').value;

                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var users = Object.values(JSON.parse(this.responseText));
                            var userSelect = document.getElementById('userSelect');
                            while (userSelect.length > 0){
                                userSelect.remove(userSelect.length - 1);
                            }
                            for (let user of users){
                                let newOption = document.createElement('option');
                                if (!user.username) user.username = 'Unknown';
                                newOption.text = user.userid + ': ' + user.username;
                                newOption.value = user.userid;
                                userSelect.add(newOption);
                            }
                            
                        }
                    };
                    xmlhttp.open('GET', 'getusers.php?course_id=' + cID, true);
                    xmlhttp.send();
                }

                function fetchUserData(){
                    let cID = document.getElementById('courseSelect').value;
                    let userID = document.getElementById('userSelect').value;
                    let timePeriod = document.getElementById('periodSelect').value;


                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var userData = this.responseText;
                            document.getElementById('mainContent').innerHTML = userData;

                        }
                    };
                    xmlhttp.open('GET', 'getUserData.php?uID=' + userID + '&cID=' + cID + '&tperiod=' + timePeriod + '&format=html', true);
                    xmlhttp.send();

                }

</script>";

global $USER, $PAGE, $DB, $CFG;


$actionview = "viewed";
$target = "course";
// select course
$courses = [
    2 => "Kurstitel2",
    3 => "Kurstitel3"
];

$course_id = 2;
// select user TODO query users from db once course is selected
$user_id = 1019;

// select activities to be considered
$selected_course_activities = [
    'mod_longpage',
    'mod_page',
    'mod_assign',
    'mod_safran'
];


$query_courseID = "
SELECT DISTINCT
    id,
    fullname
FROM {course}
ORDER BY id ASC";


$records_courseIDs = $DB->get_records_sql($query_courseID);


$courses = [];


foreach ($records_courseIDs as $singleRecord) {
    $courses[$singleRecord->id] = $singleRecord->fullname;
}



$periods = [
    "SS18",
    "WS18",
    "SS19",
    "WS19",
    "SS20",
    "WS20",
    "SS21",
    "WS21",
    "SS22",
    "WS22",
    "SS23",
    "WS23"
];







echo "<strong>Course Activities</strong><br>";

echo "<div><strong>Select Course:</strong></div>";


echo "<select id='courseSelect'>";

foreach ($courses as $key => $singleCourse) {
    echo "<option value =" . $key . ">" . $key . ": " . $singleCourse . "</option>";
}

echo "</select>";

echo "<button id='fetchUsers' onclick='fetchUsers()'>FetchUsers</button>";




echo "<div><strong>Filter by period:</strong></div>";

echo "<select id='periodSelect'>";
echo "<option value='none'>No Filter </option>";
foreach ($periods as $key => $singleEntry) {
    echo "<option value =" . $key . ">" . $singleEntry . "</option>";
}


echo "</select>";


echo "<div><strong>Select Users:</strong></div>";

echo "<select id='userSelect'>";

echo "</select>";

echo "<button id='fetchUserData' onclick='fetchUserData()'>FetchUserData</button>";



echo "<div id='mainContent'></div>";




echo $OUTPUT->footer();
