<?php

/**
 * Collect questionnaire data to create the respective section of the learner model
 */
class LearnerModelQuestionnaire extends LearnerModel{
    
    function build_model(){
        //$this->get_default_entries('mod_questionnaire');
        parent::$activity_array["mod_questionnaire"] = $this->get_questionnaire_data();
    }

    function get_questionnaire_data(){
            $query = "
                SELECT 
                concat(s.id,'-',q.id,'-',resp_results.id) AS uid, 
                s.id as questionnaire_id, s.title AS questionnaire_name, 
                -- s.courseid, 
                -- r.id as response_id, 
                r.questionnaireid, 
                r.submitted AS timecreated, 
                -- r.complete, 
                r.userid, 
                q.id as question_id, 
                q.surveyid, 
                q.name AS question_title, 
                q.type_id AS question_type, 

                -- q.content AS question_text, 
                qtype.typeid, qtype.type AS questiontype, -- qtype.response_table, 
                -- question types
                resp_results.id as resp_item, 
                -- resp_results.question_id, 
                -- resp_results.response_id, 
                -- resp_results.id, 
                -- resp_results.response_type, 
                resp_results.choice_id, resp_results.response, resp_results.rankvalue

                FROM 
                {questionnaire_survey} s 
                JOIN {questionnaire_response} r ON s.id = r.questionnaireid 
                JOIN {questionnaire_question} q ON s.id = q.surveyid 
                JOIN {questionnaire_question_type} qtype ON q.type_id = qtype.typeid 
                -- 
                JOIN (
                    SELECT resp_.id , 'resp_single' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.choice_id, 
                    -1 as rankvalue, 
                    '' as response 
                    FROM {questionnaire_resp_single} resp_

                    UNION

                    SELECT resp_.id , 'response_text' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.response, 
                    -1 as choice_id, 
                    -1 as rankvalue
                    FROM {questionnaire_response_text} resp_ 

                    UNION

                    SELECT resp_.id , 'resp_multiple' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.choice_id, 
                    -1 as rankvalue, 
                    '' as response 
                    FROM {questionnaire_resp_multiple} resp_

                    UNION 

                    SELECT resp_.id , 'response_bool' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.choice_id, 
                    -1 as rankvalue, 
                    '' as response 
                    FROM {questionnaire_response_bool} resp_

                    UNION

                    SELECT resp_.id , 'response_date' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.response, 
                    -1 as choice_id, 
                    -1 as rankvalue
                    FROM {questionnaire_response_date} resp_ 

                    UNION 

                    SELECT resp_.id , 'response_other' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.response, 
                    -1 as choice_id, 
                    -1 as rankvalue
                    FROM {questionnaire_response_other} resp_ 

                    UNION

                    SELECT resp_.id , 'response_rank' as response_type, resp_.response_id, resp_.question_id, 
                    resp_.choice_id, 
                    resp_.rankvalue, 
                    '' as response
                    FROM {questionnaire_response_rank} resp_ 

                ) resp_results ON  
                r.id = resp_results.response_id AND   
                q.id = resp_results.question_id AND
                qtype.response_table = resp_results.response_type
                -- 
                WHERE s.courseid = :course_id AND r.userid = :user_id AND r.complete = 'y' 
                ;
                ";
        // -- $TimePeriodToQuery
        $res = $GLOBALS["DB"]->get_records_sql($query, array('course_id' => parent::$course_id, 'user_id' => parent::$user_id));
        return $this->transform_questionnaire_data($res);
    }


    /**
     * Transforms array list of questionnair responses into a nested assoc. array structured by questionnaire, question, and response items
     */
    function transform_questionnaire_data($data){
        $qi = [];
        foreach($data as $item) {
            $item = (array)$item;
            $item_result = $item;
            //if(!$qi['questionnaire-'.$item['questionnaire_id']]){
                $qi['questionnaire-'.$item['questionnaire_id']] = [];
                $qi['questionnaire-'.$item['questionnaire_id']]['questionnaire_id'] = (int)$item_result['questionnaire_id'];
                $qi['questionnaire-'.$item['questionnaire_id']]['questionnaire_name'] = $item_result['questionnaire_name'];
                $qi['questionnaire-'.$item['questionnaire_id']]['questions'] = [];
            //}
            //if($qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']] == U_UNDEFINED_VARIABLE){
                $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']] = [];
                $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_id'] = (int)$item_result['question_id'];
                $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_title'] = $item_result['question_title'];
                $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_type_id'] = $item_result['question_type'];
                $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['question_type_name'] = $item_result['questiontype'];
                $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['items'] = [];
            //}
            unset($item_result['uid']);
            unset($item_result['userid']);
            unset($item_result['questionnaire_id']);
            unset($item_result['questionnaireid']);
            unset($item_result['question_id']);
            unset($item_result['questionnaire_name']);
            unset($item_result['surveyid']);
            unset($item_result['typeid']);
            unset($item_result['questiontype']);
            unset($item_result['question_type']);
            unset($item_result['question_title']);
            
            $qi['questionnaire-'.$item['questionnaire_id']]['questions']['question-'.$item['question_id']]['items']['item-'.$item['resp_item']] = $item_result;
            
        }
        return $qi;
    }
}




