<?php

require('../../config.php');
require_once('lib.php');
require_login();

$title = get_string('pluginname', 'local_ari') . ": Learner Model Inspector";
$PAGE->set_url($CFG->wwwroot . '/local/ari/learner-model-inspector.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);
//$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');


echo $OUTPUT->header();

echo    "<style>
            th {border: 1px solid #dddddd;
                padding: 4px;}
            td {border: 1px solid #dddddd;
                padding: 4px;}
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
                                newOption.text = user.userid + ': ' + user.username;
                                newOption.value = user.userid;
                                userSelect.add(newOption);
                            }
                            
                        }
                    };
                    xmlhttp.open('GET', 'getusers.php?q=' + cID, true);
                    xmlhttp.send();
                }

                function fetchUserData(){
                    var cID = document.getElementById('courseSelect').value;
                    var userID = document.getElementById('userSelect').value;

                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var userData = this.responseText;
                            document.getElementById('mainContent').innerHTML = userData;

                        }
                    };
                    xmlhttp.open('GET', 'getUserData.php?q=' + userID + '&cID=' + cID, true);
                    xmlhttp.send();

                }

</script>";

global $USER, $PAGE, $DB, $CFG;

$session_timeout = 1800;  // 1800s = 30m

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


foreach($records_courseIDs as $singleRecord){
    $courses[$singleRecord->id] = $singleRecord->fullname;
}




echo "<strong>Course Activities</strong><br>";

echo "<div><strong>Select Course:</strong></div>";


echo "<select id='courseSelect'>";

foreach ($courses as $key => $singleCourse) {
    echo "<option value =" . $key . ">" . $key . ": " . $singleCourse . "</option>";
}

echo "</select>";

echo "<button id='fetchUsers' onclick='fetchUsers()'>FetchUsers</button>";


echo "<div><strong>Select Users:</strong></div>";

echo "<select id='userSelect'>";



echo "</select>";

echo "<button id='fetchUserData' onclick='fetchUserData()'>FetchUserData</button>";


echo "<div id='mainContent'></div>";




$rr = (array) $records1;
echo print_r($rr);
$rr = (array) $records2;
echo print_r($rr);
echo '...';
foreach ($records as $record) {
    if (is_object($record)) {
        echo '____' . print_r((array)$record) . '<br>';
    }
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


echo $OUTPUT->footer();
