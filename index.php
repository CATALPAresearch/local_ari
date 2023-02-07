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

$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');

echo <<<'EOT'
<div id="app">
  <router-view></router-view>
</div>
EOT;

echo $OUTPUT->footer();
