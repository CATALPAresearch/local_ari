<?php 

if(isset($_POST['csv'])){
    header('Content-Description: File Transfer');
    header('Content-Type: text/plain');
    header('Content-Disposition: attachment; filename='.basename('moodle-course-text.csv')); 
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    echo "".str_replace(array("<br>", "\r"), "\n", $_POST['csv']);
} else {
    echo 'null';
}