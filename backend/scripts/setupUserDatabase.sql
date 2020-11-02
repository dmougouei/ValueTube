BEGIN;
CREATE TYPE user_type AS (
    userId TEXT,
    authKey TEXT,
    username TEXT,
    passwordHash TEXT,
    email TEXT,
    profilePicture TEXT
);

CREATE DOMAIN score AS BIGINT
   CHECK(VALUE >= 0 AND VALUE <= 6);

CREATE TYPE survey_result AS (
    questionId INTEGER,
    value TEXT,
    result score
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

CREATE TYPE user_value AS (
    userId TEXT,
    surveyResults survey_result[],
    valuesProfile values_matrix
);

CREATE TABLE users OF user_type;
ALTER TABLE users
    ADD CONSTRAINT user_pkey
    PRIMARY KEY (userId);

CREATE TABLE user_values OF user_value;
ALTER TABLE user_values
    ADD CONSTRAINT user_values_fkey
    FOREIGN KEY (userId)
    REFERENCES users(userId)
    ON DELETE CASCADE;

COMMIT;