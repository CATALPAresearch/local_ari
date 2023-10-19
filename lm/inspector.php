<?php

require('../../../config.php');
require_once('../lib.php');
require_login();

$title = get_string('pluginname', 'local_ari') . ": Learner Model Inspector";
$PAGE->set_url($CFG->wwwroot . '/local/ari/lm/inspector.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);

$systemContent = context_system::instance();
require_capability('moodle/analytics:managemodels', $systemContent);

global $USER, $PAGE, $DB, $CFG;

# Start with page header
echo $OUTPUT->header();


/* 
// buggy: needs to be added to a style file
echo "<style>
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
        */   

# Javscript for AJAX calls to database
echo "
<script>
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
        xmlhttp.open('GET', 'get_users.php?course_id=' + cID, true);
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
        xmlhttp.open('GET', 'learner_model.php?user_id=' + userID + '&course_id=' + cID + '&period=' + timePeriod + '&format=html', true);
        xmlhttp.send();

    }
</script>";



# Select course
$query_courseID = "
SELECT DISTINCT
    id,
    fullname
FROM {course}
ORDER BY id ASC
;
";
$records_courseIDs = $DB->get_records_sql($query_courseID);
$courses = [];
foreach ($records_courseIDs as $singleRecord) {
    $courses[$singleRecord->id] = $singleRecord->fullname;
}

echo "<h3>Course Activities</h3>";
echo "<div></div>";
echo "<div><strong>Select Course:</strong></div>";
echo "<select class='form-select mr-2' id='courseSelect' style='color: #222; background-color: lightblue; appearance: menulist!important;'>";
foreach ($courses as $key => $singleCourse) {
    echo "<option value =" . $key . ">" . $key . ": " . $singleCourse . "</option>";
}
echo "</select>";
echo "<button id='fetchUsers' onclick='fetchUsers()'>FetchUsers</button>";



# Select semester periods
$periods = [
    "WS24" => "WS 2024/25",
    #"SS24" => "SS 2024",
    "WS23" => "WS 2023/24",
    "SS23" => "SS 2023",
    "WS22" => "WS 2022/23",
    "SS22" => "SS 2022",
    "WS21" => "WS 20221/22",
    "SS21" => "SS 2021",
    "WS20" => "WS 2020/21",
    "SS20" => "SS 2020",
    "WS19" => "WS 2019/20",
    "SS19" => "SS 2019",
    "WS18" => "WS 2018/19",
    "SS18" => "SS 2018",
];
echo "<div><strong>Filter by period:</strong></div>";
echo "<select id='periodSelect' class='form-select' style='color: #222; background-color: lightblue; appearance: menulist!important;'>";
echo "<option value='none'>No Filter </option>";
foreach ($periods as $key => $singleEntry) {
    echo "<option value =" . $key . ">" . $singleEntry . "</option>";
}
echo "</select>";



# Select user 
echo "<div><strong>Select Users:</strong></div>";
echo "<select id='userSelect' class='form-select mr-2' id='courseSelect' style='color: #222; background-color: lightblue; appearance: menulist!important;'>";
echo "</select>";
echo "<button id='fetchUserData' onclick='fetchUserData()'>FetchUserData</button>";


# Content
echo "<div id='mainContent'></div>";

# end with footer
echo $OUTPUT->footer();
