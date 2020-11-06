BEGIN;

CREATE TYPE question_option AS
(
	option_val int,
	option_text text
);

CREATE TYPE question AS
(
	questionid int,
	question_text text,
	value_attrib text,
	question_options question_option[],
	internal_notes TEXT
);

CREATE TABLE questions OF question;

alter table questions
	add constraint questions_pk
		primary key (questionid);
COMMIT;
