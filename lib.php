<?php

/**
 * @package ARI
 * @author Marc Burchart <marc.burchart@fernuni-hagen.de>
 * @copyright FernUniversität Hagen
 * @license http://www.gnu.org/copyleft/gpl.html
 */

defined('MOODLE_INTERNAL') || exit(0);

require_once($CFG->libdir.'/filelib.php');
require_once($CFG->libdir.'/completionlib.php');

global $PAGE;

function local_ari_extend_navigation() {
    global $PAGE;
    $PAGE->requires->js_call_amd("local_ari/loader", "init");
}

?>