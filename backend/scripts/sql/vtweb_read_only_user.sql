/*COMPLETED BY: Bethany Cooper */
-- use ssh forwarding to connect to database on remote db server to create an encrypted tunnel and only use a read only account for access this way. Then, use SCRAM method of authentication using SHA-256 9NOT MD5!!!). Also, do not allow any remote hosts (inc from lan) to connect
-- to the database using these accounts, unless through ssh tunnel. Also set strong firewall rules.
-- for more sensitive data, use a MUCH MORE secure method

create user vtweb_readonly WITH PASSWORD 'pass'
	noinherit NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION VALID UNTIL 'infinity';

GRANT CONNECT ON DATABASE valuetube TO vtweb_readonly;
GRANT USAGE ON SCHEMA public TO vtweb_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO vtweb_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO vtweb_readonly;
