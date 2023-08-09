<?php

require('../../config.php');
require_once('lib.php');
require_login();

$title = get_string('pluginname', 'local_ari') . ": Simplified content model";
$PAGE->set_url($CFG->wwwroot.'/local/ari/content-model.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_title($title);
$PAGE->set_heading($title);
//$PAGE->requires->js_call_amd('local_ari/app-lazy', 'init');


echo $OUTPUT->header();

echo "
<strong>How the simplified content model is created</strong>
<ol>
    <li>Chose a course and the activity plugins to be considers in the model</li>
    <li>Compile a CSV file containing all text content from the activity plugins</li>
    <li>Run a python script to extract keywords per plugin instance: python3.9 scripts/keyword_extraction.py --method ner --input 0</li>
    <li>Upload the resulting content-model.csv file conatining keywords for each plugin instance and store it in the Moodle database</li>
    <li>Run queries on the content model using SQL</li>
</ol>
";

global $USER, $PAGE, $DB, $CFG;
// select course
$course_id = 2;

// select activities to be considered
$selected_course_activities = [
    'mod_longpage',
    'mod_page',
    'mod_assign',
    'mod_safran'
];

// 
$csv = "course_id;component;instance_url_id; instance_id; instance_section_num; text; <br>";

// Longpage
if(in_array('mod_longpage', $selected_course_activities)){
    $query = "
    SELECT 
        cm.id AS instance_url_id,
        p.id AS instance_id, 
        p.name, 
        p.intro, 
        p.content
    FROM {course_modules} AS cm
    JOIN {modules} AS m 
        ON m.id = cm.module
    JOIN {course_sections} AS cs 
        ON cs.id = cm.section
    RIGHT OUTER JOIN {longpage} AS p
        ON cm.instance = p.id 
    WHERE 
        m.name = 'longpage' AND
        m.visible = 1 AND
        cm.visible = 1 AND
        p.course = ?
    ";
    $records = $DB->get_records_sql($query, array($course_id));   
    echo 'mod_longpage: ' . count($records) .' instances <br>';
    foreach($records as $record){    
        if(isset($record->instance_id)) {
            $text = $record->name . ' ' . $record->intro . ' ' . $record->content;
            // Strip HTML but leave H3 headings
            $text = str_replace(array("\r", "\n"), ' ', $text);
            $text = strip_tags($text, '<h3>');
            $text = str_replace(array(";", ",", "'", '"', "</h3>"), ' ', $text);
            $text = str_replace(";", ' ', $text);
            $text = preg_replace('/\s+/', ' ', $text);
            // Split longpage / page content by H2 and H3 tag
            $text_sections = explode("<h3>", $text);
            print('-  <a href="'. new moodle_url('/mod/longpage/view.php', array('id' => $record->instance_url_id)) .'">instance_id '.$record->instance_id . '</a> has ' . sizeof($text_sections) . 'sections <br>');
            foreach($text_sections as $section_num=>$section){
                if(isset($section)) {
                    $csv .= $course_id . "; " ."mod_longpage;" . $record->instance_url_id . "; " . $record->instance_id . "; " . $section_num . "; " . $section . " <br>";
                }
            }
        }
    }       
}


// PAGE
if(in_array('mod_page', $selected_course_activities)){
    $query = "
    SELECT 
        cm.id AS instance_url_id,
        p.id AS instance_id, 
        p.name, 
        p.intro, 
        p.content
    FROM {course_modules} AS cm
    JOIN {modules} AS m 
        ON m.id = cm.module
    JOIN {course_sections} AS cs 
        ON cs.id = cm.section
    RIGHT OUTER JOIN {page} AS p
        ON cm.instance = p.id 
    WHERE 
        m.name = 'page' AND
        m.visible = 1 AND
        cm.visible = 1 AND
        p.course = ?
    ";
    $records = $DB->get_records_sql($query, array($course_id));   
    echo 'mod_page: ' . count($records) .' instances <br>';
    foreach($records as $record){    
        if(isset($record->instance_id)) {
            $text = $record->name . ' ' . $record->intro . ' ' . $record->content;
            // Strip HTML but leave H3 headings
            $text = strip_tags($text, '<h3>');
            $text = str_replace(array("\r", "\n"), ' ', $text);
            $text = str_replace(array(";", "'", '"', "</h3>"), ' ', $text);
            $text = preg_replace('/\s+/', ' ', $text);
            // Split page / page content by H2 and H3 tag
            $text_sections = explode("<h3>", $text);
            print('-  <a href="'. new moodle_url('/mod/page/view.php', array('id' => $record->instance_url_id)) .'">instance_id '.$record->instance_id . '</a> has ' . sizeof($text_sections) . 'sections <br>');
            // print($text_sections[1]);
            foreach($text_sections as $section_num=>$section){
                //print($section_num);
                if(isset($section)) {
                    $csv .= $course_id . "; " ."mod_page;" . $record->instance_url_id . "; " . $record->instance_id . "; " . $section_num . "; " . $section . " <br>";
                }
            }
        }
    }     
}

// ASSIGNMENTS
if(in_array('mod_assign', $selected_course_activities)){
    $query = "
    SELECT 
        cm.id AS instance_url_id,
        p.id AS instance_id, 
        p.name, 
        p.intro
    FROM {course_modules} AS cm
    JOIN {modules} AS m 
        ON m.id = cm.module
    JOIN {course_sections} AS cs 
        ON cs.id = cm.section
    RIGHT OUTER JOIN {assign} AS p
        ON cm.instance = p.id 
    WHERE 
        m.name = 'assign' AND
        m.visible = 1 AND
        cm.visible = 1 AND
        p.course = ?
    ";
    $records = $DB->get_records_sql($query, array($course_id));   
    echo 'mod_assign: ' . count($records) .' instances <br>';
    foreach($records as $record){    
        if(isset($record->instance_id)) {
            $text = $record->name . ' ' . $record->intro;
            // Strip HTML but leave H3 headings
            $text = strip_tags($text, '<h3>');
            $text = str_replace(array("\r", "\n"), ' ', $text);
            $text = str_replace(array(";", "'", '"'), ' ', $text);
            $text = trim(preg_replace('/\s+/', ' ', $text));
            $section_num = 0;
            $csv .= $course_id . "; " ."mod_assign; " . $record->instance_url_id . "; " . $record->instance_id . "; " . $section_num . "; " . $text . " <br>";
            print('-  <a href="'. new moodle_url('/mod/assign/view.php', array('id' => $record->instance_url_id)) .'">instance_id '.$record->instance_id . '</a> <br>');
        }
    }
} 

// SAFRAN
if(in_array('mod_safran', $selected_course_activities)){
   $query = "
    SELECT 
        cm.id AS instance_url_id,
        q.id AS instance_id, 
        q.question_title, 
        q.question_text, 
        q.solution,
        f.feedbacktext,
        c.criteria
    FROM {course_modules} AS cm
    JOIN {modules} AS m 
        ON m.id = cm.module
    JOIN {course_sections} AS cs 
        ON cs.id = cm.section
    RIGHT OUTER JOIN {safran_question} AS q
        ON cm.instance = q.id 
    JOIN mdl_safran_feedback f 
        ON q.id = f.taskid 
    JOIN mdl_safran_criteria c 
        ON q.id = c.taskid
    WHERE 
        m.name = 'safran' AND
        m.visible = 1 AND
        cm.visible = 1 AND
        q.course = ?
    ";
    $records = $DB->get_records_sql($query, array($course_id));   
    echo 'mod_safran: ' . count($records) .' instances <br>';
    foreach($records as $record){    
        if(isset($record->instance_id)) {
            $text = $record->question_title . ' ' . $record->question_text . ' ' . $record->solution . ' ' . $record->feedbacktext . ' ' . $record->criteria;
            // Strip HTML but leave H3 headings
            $text = strip_tags($text, '<h3>');
            $text = str_replace(array("\r", "\n"), ' ', $text);
            $text = str_replace(array(";", "'", '"'), ' ', $text);
            $text = trim(preg_replace('/\s+/', ' ', $text));
            $section_num = 0;
            $csv .= $course_id . "; " ."mod_safran; " . $record->instance_url_id . "; " . $record->instance_id . "; " . $section_num . "; " . $text . " <br>";
            print('-  <a href="'. new moodle_url('/mod/safran/view.php', array('id' => $record->instance_url_id)) .'">instance_id '.$record->instance_id . '</a> <br>');
        }
    }
}


// write text data to file
//echo '<textarea style="width:800px;">'.$csv.'</textarea>';
$html_str = "<form id='view_form' action='content-model-text-download.php' method='post' >";
$html_str .= "<input style='display:none;' name='csv' type='text' value='".$csv."' >";
$html_str .= "<input id='view_button' type='submit' value='Download CSV file' >";
$html_str .= "</form>";
echo $html_str;


// upload CSV of instance id and assigned keywords and save it to the database
$addToDatabase = false;
$row = 1;
if ($addToDatabase && ($handle = fopen("content-model.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
        $num = count($data);
        //echo "<p> $num fields in line $row: <br /></p>\n";
        $row++;
        for ($c=0; $c < $num; $c++) {
            //echo explode($data[$c][0], ';') . "<br />\n";
            $row = explode(',',$data[$c]);
            //echo $row[5] . "<br>";
            $DB->insert_record('ari_content_model', array(
                "course_id" => (int)$row[0],
                "component" => $row[1], 
                "instance_url_id" => (int)$row[2], 
                "instance_id" => (int)$row[3], 
                "instance_section_num" => (int)$row[4], 
                "keyword" => $row[5],
                "document_frequency" => (float)$row[6]
            ));
        }
    }
    fclose($handle);
}

// enable editing of the content model (e.g. adding and changing keywords)

echo "<br>";
echo "<br>";
echo "<strong>Some query</strong><br>";
// query
$query = "
SELECT DISTINCT
a2.id,
aa1.keyword AS search_term,
a2.instance_id,
a2.component,
aa1.document_frequency AS freq1,
a2.document_frequency AS freq2
FROM (
SELECT keyword, id, document_frequency
FROM mdl_ari_content_model  a1
WHERE 
course_id=? AND
instance_id = 1
ORDER BY document_frequency DESC
LIMIT 10
) as aa1
JOIN mdl_ari_content_model a2 ON a2.keyword = aa1.keyword
WHERE 
aa1.id <> a2.id AND
course_id=?
ORDER BY aa1.document_frequency DESC
";
$records = $DB->get_records_sql($query, array($course_id, $course_id));   
    echo 'res: ' . count($records) .' instances <br>';
    foreach($records as $record){    
        echo $record->id .' '. $record->search_term . '<br>';
    }

// visualize content model using a D3.js network

/*echo <<<'EOT'
<div id="app"></div>
EOT;*/

echo $OUTPUT->footer();