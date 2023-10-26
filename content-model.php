<?php

require('../../config.php');
require_once('lib.php');
require_login();

$title = get_string('pluginname', 'local_ari') . ": Content Model";
$PAGE->set_url($CFG->wwwroot.'/local/ari/content-model.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);
//$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');


echo $OUTPUT->header();

echo "<h3>Content Model</h3>";
echo "
<strong>How is the content model for a course created?</strong>
<ol>
    <li>All text content from the activity plugins mod_page, mod_longpage, mod_assign, and mod_quiz are extracted. The text sections from mod_page and mod_longpage are split up at the H3 headings.</li>
    <li>For every instance of an activity plugin (and text sections) keywords are computed using Python Rake. This step is performed in the university-api backend.</li>
    <li>The resulting keywords are stored in the Moodle database</li>
</ol>
<strong>How is the content model used?</strong>
<ul>
    <li>Find similare instances of activity plugins: ...</li>
    <li>...</li>
</ul>
<strong>What are the limitations of this approach?</strong>
<ul>
    <li>Semantical meaning: ...</li>
    <li>Mixed language: ...</li>
</ul>
";

global $USER, $PAGE, $DB, $CFG;

/*
TODO: Enable teachers to edit the keywords of their course
*/
echo "<h3>[TBA keyword editing]</h3>";
echo "...";
/**
 * Visualize Keywords, e.g. as a tag cloud using D3.js
 */
echo "<h3>Visualise Keywords</h3>";
$query = "
SELECT DISTINCT
    a2.id,
    aa1.keyword AS search_term,
    a2.instance_id,
    a2.instance_url_id,
    a2.component,
    aa1.document_frequency AS score1,
    a2.document_frequency AS score2
FROM (
    SELECT a1.course_id, a1.keyword, a1.id, a1.document_frequency, a1.instance_url_id
    FROM {ari_content_model} a1
    WHERE 
        a1.course_id=2 AND
        a1.instance_url_id = 185
    ORDER BY a1.document_frequency DESC
    LIMIT 20
    ) as aa1
JOIN {ari_content_model} a2 ON a2.keyword = aa1.keyword
WHERE 
    aa1.id <> a2.id AND
    a2.course_id=aa1.course_id AND
    aa1.instance_url_id <> a2.instance_url_id
ORDER BY aa1.document_frequency, a2.document_frequency DESC
LIMIT 5
;";
$records = $DB->get_records_sql($query, array("course_id"=>2, "url_id"=>224,));   
    echo 'res: ' . count($records) .' instances <br>';
    foreach($records as $record){    
        echo $record->search_term . ' - freq1=' . $record->freq1 . ' - freq2=' . $record->freq2 .'<br>';
    }


/*echo <<<'EOT'
<div id="app"></div>
EOT;*/

echo $OUTPUT->footer();