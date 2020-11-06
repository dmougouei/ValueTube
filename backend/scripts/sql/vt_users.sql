/*COMPLETED BY: Bethany Cooper */
BEGIN;

CREATE DOMAIN schwartz_score AS BIGINT
   CHECK(VALUE >= 0 AND VALUE <= 6);

CREATE TYPE schwartz_survey_result AS (
   question_id int,
   value_attrib text,
   val_chosen schwartz_score
);

CREATE TYPE values_matrix AS (
   self_direction REAL,
   stimulation REAL,
   hedonism REAL,
   achievement REAL,
   power REAL,
   security REAL,
   tradition REAL,
   conformity REAL,
   benevolence REAL,
   universalism REAL
);

CREATE TABLE users
(
	userid int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	last_name text,
	first_name text,
	pictureUrl text,
	email text,
	emailVerified text,
	username text,
	salt varchar,
	passhash varchar,
	created_at timestamp
);

CREATE TABLE user_value_profile
(
    val_profile_id int GENERATED ALWAYS AS IDENTITY,
	userid int,
	schwartz_survey_results schwartz_survey_result[],
	schwartz_values_profile values_matrix,
	created_at timestamp,
	CONSTRAINT UID
      FOREIGN KEY(userid)
	  REFERENCES users(userid)
);

COMMIT;
