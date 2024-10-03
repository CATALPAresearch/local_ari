<?php


/**
 * LearnerModelOutput
 * @param $activity_array
 * @param $elapsedTime
 */
class LearnerModelOutput{
    
    public $activity_array = [];
    public $elapsedTime = 0;

    function __construct($activity_array, $elapsedTime) {
        $this->activity_array = $activity_array;
        $this->elapsedTime = $elapsedTime;

        $output_format = $this->validate_output_format();

        switch($output_format){
            case 'json':
                $this->generate_json_output();
                break;
            case 'html':
                $this->generate_html_output();
                break;
        }
    }

    function validate_output_format(){
        $output_format = 'json'; # default
        $accepted_output_formats = ['json', 'html', 'debug'];
        
        if (isset($_REQUEST["format"]) && in_array($_REQUEST["format"], $accepted_output_formats)) {
            $output_format = $_REQUEST["format"];
        } else{
            die;
        }
        return $output_format;
    }
    
    function generate_json_output(){
        header('Content-Type: application/json; charset=utf-8');
        print_r(json_encode($this->activity_array));
    }
    
    function generate_html_output(){
        echo "<div>ElapsedTime(DBfetch): " . number_format($this->elapsedTime, 10) . " us</div>";
        // generate html from data (activity_array)
        foreach ($this->activity_array as $key1 => $activity) {
            echo "<strong class='activityDescription'>" . $key1 . "</strong><br>";
    
            $table_headers = "<thead><tr>";
            $table_data = "<tbody><tr>";
    
            foreach ($activity as $key2 => $entry) {
                $table_headers .= "<th>" . $key2 . " </th>";
                if (is_array($entry)) {
                    $arrayInTable = "<div class='arrayInTableStyle'>";
                    foreach ($entry as $key => $arrayEntry) {
                        $arrayInTable .= "<div>$arrayEntry</div>";
                    }
                    $arrayInTable .= "</div>";
                    $table_data .= "<td>" . $arrayInTable . " </td>";
                } else {
                    $table_data .= "<td>" . $entry . " </td>"; // TODO: Object of class DateTimeImmutable could not be converted to string
                }
            }
            echo "<div><table>" . $table_headers . "</tr></thead>" . $table_data . "</tr></tbody></table></div><br>";
        }
    }
}