<?php

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir.'/filelib.php');
require_once($CFG->libdir.'/completionlib.php');

global $PAGE;

$PAGE->requires->js_call_amd("local_ari/loader", "init");


?>