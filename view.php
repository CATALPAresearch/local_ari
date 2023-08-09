<?php

require('../../config.php');
require_once('lib.php');

$title = get_string('pluginname', 'local_ari');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);
//$PAGE->set_url(new moodle_url('/local_ari'));
//$PAGE->requires->css(new moodle_url('/local/local_ari/styles.css'));
$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');
$PAGE->navbar->add(get_string('pluginname', 'local_ari'));


echo $OUTPUT->header();

echo <<<'EOT'
<div id="app"></div>
EOT;

echo $OUTPUT->footer();

