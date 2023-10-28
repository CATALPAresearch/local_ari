
CREATE TABLE ari_content_model (
  id int NOT NULL AUTO_INCREMENT,
  course_id int NOT NULL,
  component varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  instance_url_id int NOT NULL,
  instance_id int NOT NULL,
  instance_section_num int NOT NULL,
  keyword text COLLATE utf8mb4_unicode_ci NOT NULL,
  document_frequency int NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE ari_response_rule_action (
  id int NOT NULL AUTO_INCREMENT,
  course_id int NOT NULL,
  user_id int NOT NULL,
  action_id text COLLATE utf8mb4_unicode_ci NOT NULL,
  response_type text COLLATE utf8mb4_unicode_ci NOT NULL,
  response text COLLATE utf8mb4_unicode_ci NOT NULL,
  timecreated int NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE ari_response_rule_execution (
  id bigint NOT NULL AUTO_INCREMENT,
  course_id bigint NOT NULL,
  user_id bigint NOT NULL,
  rule_id bigint NOT NULL,
  status text COLLATE utf8mb4_unicode_ci NOT NULL,
  count int NOT NULL DEFAULT '0',
  PRIMARY KEY (id),
  KEY ariruleexec_ru_ix (rule_id),
  KEY ariruleexec_us_ix (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule (
  id bigint NOT NULL AUTO_INCREMENT,
  title varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  course_id bigint NOT NULL,
  is_active binary(1) NOT NULL,
  isPerSectionRule binary(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule_action (
  id bigint NOT NULL AUTO_INCREMENT,
  rule_id bigint NOT NULL,
  section text COLLATE utf8mb4_unicode_ci NOT NULL,
  actor_id bigint DEFAULT NULL,
  action_title longtext COLLATE utf8mb4_unicode_ci,
  action_text longtext CHARACTER SET utf32 COLLATE utf32_german2_ci,
  action_type_id bigint DEFAULT NULL,
  action_category_id bigint DEFAULT NULL,
  course_id bigint DEFAULT NULL,
  target_context_id bigint NOT NULL,
  dom_content_selector varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  dom_indicator_selector varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  viewport_selector varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  timing_id bigint DEFAULT NULL,
  delay bigint DEFAULT NULL,
  priority bigint DEFAULT NULL,
  repetitions bigint NOT NULL,
  PRIMARY KEY (id),
  KEY ariruleacti_me_ix (actor_id),
  KEY ariruleacti_mo_ix (target_context_id),
  KEY ariruleacti_ti_ix (timing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED;


CREATE TABLE ari_rule_action_augment (
  id int NOT NULL,
  action_id int NOT NULL,
  augmentation_id int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE ari_rule_action_category (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE ari_rule_action_type (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE ari_rule_actor (
  id bigint NOT NULL AUTO_INCREMENT,
  name varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule_condition (
  id bigint NOT NULL AUTO_INCREMENT,
  rule_id bigint NOT NULL,
  source_context_id int NOT NULL,
  lkey varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  lvalue bigint NOT NULL,
  operator_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY arirulecond_op_ix (operator_id),
  KEY arirulecond_ru_ix (rule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule_operator (
  id bigint NOT NULL AUTO_INCREMENT,
  name varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule_source_context (
  id bigint NOT NULL AUTO_INCREMENT,
  name varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule_target_context (
  id bigint NOT NULL AUTO_INCREMENT,
  name varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_rule_timing (
  id bigint NOT NULL AUTO_INCREMENT,
  name varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED COMMENT='Default comment for the table, please edit me';


CREATE TABLE ari_user_enrollments (
  id int NOT NULL AUTO_INCREMENT,
  userid int NOT NULL,
  username varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  enrolled_course_id int NOT NULL,
  enrolled_course_title varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  enrollment_repeated varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  credits int NOT NULL,
  semesteryear int NOT NULL,
  semester int NOT NULL,
  year int NOT NULL,
  booked_weekly_hours int NOT NULL,
  PRIMARY KEY (id)
) 

-- ----------------------------------------------------------

CREATE TABLE "ari_rule_action_category" (
  "id" integer NOT NULL,
  "name" text NOT NULL
);


CREATE TABLE "ari_rule_action_type" (
  "id" integer NOT NULL,
  "name" text NOT NULL
);



----


INSERT INTO   ari_rule_action_category  ( id ,  name ) VALUES
(1,	'time_management'),
(2,	'progress'),
(3,	'success'),
(4,	'social'),
(5,	'competency');


INSERT INTO   ari_rule_action_type  ( id ,  name ) VALUES
(1,	'scope_course'),
(2,	'scope_course_unit'),
(3,	'scope_activity_type'),
(4,	'scope_activity'),
(5,	'next_step');

INSERT INTO   ari_rule_actor  ( id ,  name ) VALUES
(1,	'alert'),
(2,	'prompt'),
(3,	'confirm'),
(4,	'style'),
(5,	'modal'),
(6,	'htmlPrompt'),
(7,	'dashboard_course'),
(8,	'dashboard_course_unit'),
(9,	'dashboard_activity'),
(10,	'storedPrompt');


INSERT INTO   ari_rule_augmentations  ( id ,  name ) VALUES
(1,	'user_data'),
(2,	'learner_model'),
(3,	'related_resource'),
(4,	'next_step'),
(5,	'LLprompt');


INSERT INTO   ari_rule_operator  ( id ,  name ) VALUES
(1,	'<'),
(2,	'sum()<'),
(3,	'sumR()<'),
(4,	'>'),
(5,	'sum()>'),
(6,	'sumR()>'),
(7,	'=='),
(8,	'contains'),
(9,	'similar'),
(10,	'has');

INSERT INTO   ari_rule_source_context  ( id ,  name ) VALUES
(6,	'mod_page'),
(7,	'mod_longpage'),
(8,	'mod_safran'),
(9,	'mod_assign'),
(10,	'mod_usenet'),
(11,	'mod_quiz'),
(17,	'mod_hypervideo'),
(18,	'user'),
(19,	'course_enrollments'),
(20,	'mod_questionnaire');

INSERT INTO   ari_rule_target_context  ( id ,  name ) VALUES
(6,	'mod_page'),
(7,	'mod_longpage'),
(8,	'mod_safran'),
(9,	'mod_assign'),
(10,	'mod_usenet'),
(11,	'mod_quiz'),
(17,	'mod_hypervideo'),
(20,	'mod_questionnaire'),
(21,	'login_page'),
(22,	'home_page'),
(23,	'profile_page'),
(24,	'course_participants'),
(25,	'course_overview_page'),
(26,	'local_ari');

INSERT INTO   ari_rule_timing  ( id ,  name ) VALUES
(1,	'now'),
(2,	'when_visible'),
(3,	'when_idle');

