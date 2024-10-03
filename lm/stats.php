<?php

# compute and store data for one course
if(isset($REQUEST['compute_data_of_course'])){
    $course_id = 2;

    # check if data for this course was already collected
    //
    
    # get all user for a course
    $query_user_ids = "
        SELECT DISTINCT
            userid,
            users.username
        FROM {logstore_standard_log}
        LEFT JOIN {user} AS users
            ON users.id = userid
        WHERE
            courseid = :course_id
        ORDER BY userid ASC
        ;
        ";

    $users = $DB->get_records_sql($query_user_ids, array('course_id' => $course_id));
    
    $weeks = [];

    # get LM for each user and week
    foreach($users as $user){
        foreach($weeks as $week){
            # make LM flat
            
            # store flat data: user, week, key, value

        }
    }
}

# requst data for visualization
if(isset($REQUEST['get_data_of_course'])){
    echo "get_data_of_course";
}

