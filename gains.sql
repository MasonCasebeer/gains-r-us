
CREATE DATABASE gains;

CREATE TABLE "user" (
	"name" character varying(15),
	"surname" character varying(15),
    "age" smallint,
    "weight" smallint,
    "gender" char,
	"userid" character(5) NOT NULL PRIMARY KEY
);

CREATE TABLE "routine" (
	"name" character varying(15),
	"type" character varying(15),
    "routineid" character(5) NOT NULL PRIMARY KEY,
    FOREIGN KEY "user"
    REFERENCES user(userid)
);

CREATE TABLE "workout" (
	"name" character varying(15),
	"workoutid" character(5) NOT NULL PRIMARY KEY,
    FOREIGN KEY "user"
    REFERENCES user(userid),
    FOREIGN KEY "routine"
    REFERENCES routine(routineid)
);

--TODO need a linking table workout -> exercise since this is many to many 

CREATE TABLE "exercise" (
	"name" character varying(15),
    "muscle" character varying(15),
	"exerciseid" character(5) NOT NULL PRIMARY KEY,
);

CREATE TABLE "set" (
    "set_id" serial PRIMARY KEY,
    "reps" smallint,
    "weight" smallint,
    CONSTRAINT
    FOREIGN KEY "exercise"
    REFERENCES exercise(exerciseid)
    CONSTRAINT
    FOREIGN KEY "workout"
    REFERENCES workout(workoutid)
);

--TODO 
--write a ton of insert statements (wheeler maybe?)