<?php

require('../../config.php');
require_once('lib.php');


$PAGE->set_context(context_system::instance());
$PAGE->set_title(get_string('pluginname', 'local_ari'));
//$PAGE->set_url(new moodle_url('/local_ari'));
//$PAGE->requires->css(new moodle_url('/local/local_ari/styles.css'));
$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');
//$PAGE->requires->js_call_amd('local_ari/main', 'init');
$PAGE->navbar->add(get_string('pluginname', 'local_ari'));


//$pdata = strtolower(basename(dirname(__DIR__)).'_'.basename(__DIR__)).'\core\pinfo';
//$pdata = new $pdata();
//$pdata = $pdata->getData();

//$url = new moodle_url("{$pdata->moodlePath}/view.php");
//$PAGE->set_url($url);
//$PAGE->requires->js_call_amd("local_ari/loader", "init");  //array($CFG->wwwroot)



echo $OUTPUT->header();

echo <<<'EOT'
<h1>ARI - Test</h1>
<div id="app">
    <span>vue</span>
    <router-view></router-view>
</div>
EOT;

echo $OUTPUT->footer();

