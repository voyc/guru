/* psql -f createdb.sql jhagstrand_guru jhagstrand_guru */

/* create schema guru; */

drop table guru.work;
create table guru.work (
	id serial,
	name varchar(100),
	author varchar(100)
);

drop table guru.quote;
create table guru.quote (
	id serial,
	workid integer,
	content varchar(1000)
);
