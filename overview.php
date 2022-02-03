<?php
/***
 * ARI
 */

require_once(dirname(__FILE__) . '/../../config.php');

$context = context_system::instance();
global $USER, $PAGE, $DB, $CFG;
require_login();
$PAGE->set_context($context);
$PAGE->set_url($CFG->wwwroot . '/local/ari/overview.php');
// $PAGE->set_pagelayout('course');
$PAGE->set_pagelayout('standard');
$PAGE->set_title("Adaptation Rule Interface");
//$PAGE->set_heading($title);
echo $OUTPUT->header();

global $DB, $USER;
$message = '';


// $PAGE->requires->js_call_amd('format_ladtopics/Policy', 'init', array('policies' => $res, 'message' => $message, 'backurl' => $policy_back));





$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');

echo <<<'EOT'
<div id="app">
  <router-view></router-view>
</div>
EOT;

echo $OUTPUT->footer();
