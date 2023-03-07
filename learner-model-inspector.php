<?php

require('../../config.php');
require_once('lib.php');
require_login();

$title = get_string('pluginname', 'local_ari') . ": Learner Model Inspector";
$PAGE->set_url($CFG->wwwroot.'/local/ari/learner-model-instector.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);
//$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');


echo $OUTPUT->header();

echo "
<strong>How the learner model is created</strong>
<ol>
    <li>...</li>
    <li>...</li>
    <li>...</li>
</ol>
";

global $USER, $PAGE, $DB, $CFG;
// select course
$course_id = 2;
// select user
$user_id = 2;

// select activities to be considered
$selected_course_activities = [
    'mod_longpage',
    'mod_page',
    'mod_assign',
    'mod_safran'
];


echo "<strong>Course Activities</strong><br>";
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
$query = "
SELECT 
    timecreated AS first_accsess 
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? 
ORDER BY timecreated ASC
LIMIT 1
";
$query = "
SELECT 
    timecreated AS last_accsess 
FROM {logstore_standard_log}
WHERE 
    courseid = ? AND
    userid = ? 
ORDER BY timecreated DESC
LIMIT 1
";
$records = $DB->get_record_sql($query, array($course_id, $user_id));   
#echo print_r((array)$records);#->last_access . '<br>';
#$rr = (array) $records;
#echo print_r($rr);
echo '...';
foreach($records as $record){
    if(is_object($record)){
        echo '____'. print_r((array)$record) . '<br>';
    }
}


echo $OUTPUT->footer();