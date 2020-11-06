-- enable crypt extension
CREATE EXTENSION pgcrypto;

-- delete irrelevant tables
BEGIN;
TRUNCATE users, user_value_profile RESTART IDENTITY;
ALTER TABLE users ALTER COLUMN emailverified TYPE boolean USING emailverified::boolean;
ALTER TABLE users DROP COLUMN salt;
COMMIT;

-- insert user into users 

BEGIN;
INSERT INTO users VALUES (default, 'SURNAME4', 'NAME4', 'PIC.URL', 'NAME@email', TRUE, 'USERNAME4', crypt('password', gen_salt('bf', 8)), NOW()::timestamp);
COMMIT;

-- insert user values profile into user_value_profile
BEGIN;
INSERT INTO user_value_profile VALUES (default, 4, ARRAY[(1, 'self_direction', 6)::schwartz_survey_result, (2, 'power', 4)::schwartz_survey_result, (3, 'universalism', 3)::schwartz_survey_result], (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)::values_matrix, NOW()::timestamp);
COMMIT;

-- check if user entered password to login successfully
SELECT * FROM users WHERE email = 'NAME@email' AND passhash = crypt('password', passhash); 

