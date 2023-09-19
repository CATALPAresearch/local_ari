<?php
/***
 * ARI Adaptation Rule Dashboard
 */

require_once(dirname(__FILE__) . '/../../config.php');

$context = context_system::instance();
global $USER, $PAGE, $DB, $CFG;
$PAGE->set_context($context);
$PAGE->set_url($CFG->wwwroot . '/local/ari/index.php');
require_login();
// $PAGE->set_pagelayout('course');
$PAGE->set_pagelayout('standard');
$PAGE->set_title("Adaptation Rule Dashboard");
$PAGE->set_heading("Adaptation Rule Dashboard");
echo $OUTPUT->header();

global $DB, $USER;
$message = '';

$PAGE->requires->js_call_amd('local_ari/app-lazy', 'initAdaptationDashboard');


echo <<<'EOT'
<div id="adaptationDashboardApp"></div>
EOT;

function install(){
    /*
     INSERT INTO `mthreeeleven_ari_rule_moodle_context` (`id`, `title`) VALUES
(1,	'login_page'),
(2,	'home_page'),
(3,	'profile_page'),
(4,	'course_participants'),
(5,	'course_overview'),
(6,	'mod_page'),
(7,	'mod_longpage'),
(8,	'mod_safran'),
(9,	'mod_assignment'),
(10,	'mod_usenet'),
(11,	'mod_quiz'),
(12,	'mod_quiz_attempt'),
(13,	'mod_quiz_summary'),
(14,	'mod_quiz_review'),
(15,	'mod_safran_review'),
(16,	'unknown'),
(17,	'mod_hypervideo');
     */
}

echo $OUTPUT->footer();
