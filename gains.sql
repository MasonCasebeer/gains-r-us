
CREATE DATABASE gains;

CREATE TABLE "user" (
	"name" character varying(15),
	"userid" character(5) NOT NULL,
);

CREATE TABLE "routine" (
	"name" character varying(15),
	"routineid" character(5) NOT NULL,
);

CREATE TABLE "workout" (
	"name" character varying(15),
	"workoutid" character(5) NOT NULL,
);

CREATE TABLE "exercise" (
	"name" character varying(15),
	"exerciseid" character(5) NOT NULL,
);