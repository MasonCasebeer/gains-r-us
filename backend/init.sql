
CREATE DATABASE gains;


CREATE TABLE IF NOT EXISTS "users" (
	"name" character varying(15),
	"surname" character varying(15),
    "username" character varying(15) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash CHAR(128) NOT NULL,
    salt CHAR(32) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
    "age" smallint,
    "weight" smallint,
    "gender" char,
	"userid" serial NOT NULL PRIMARY KEY
);

select * from "users";

-- DROP TABLE IF EXISTS "routine";
-- CREATE TABLE "routine" (
-- 	"name" character varying(15),
-- 	"type" character varying(15),
--     "routineid" smallint NOT NULL PRIMARY KEY,
--     "userid" smallint NOT NULL,
--     FOREIGN KEY ("userid") REFERENCES "user"("userid")
-- );

-- DROP TABLE IF EXISTS "workout";
-- CREATE TABLE "workout" (
-- 	"name" character varying(15),
-- 	"date" character varying(12),
-- 	"workoutid" smallint NOT NULL PRIMARY KEY,
--     "routineid" smallint NOT NULL,
--     "userid" smallint NOT NULL,
--     FOREIGN KEY ("userid") REFERENCES "user"("userid"),
--     FOREIGN KEY ("routineid") REFERENCES "routine"("routineid")
-- );

-- DROP TABLE IF EXISTS "exercise";
-- CREATE TABLE "exercise" (
-- 	"name" character varying(15),
--     "muscle" character varying(15),
-- 	"exerciseid" smallint NOT NULL PRIMARY KEY
-- );

-- DROP TABLE IF EXISTS "workout_exercise";
-- CREATE TABLE "workout_exercise" (
-- 	"workoutid" smallint NOT NULL,
-- 	"exerciseid" smallint NOT NULL,
--     FOREIGN KEY ("workoutid") REFERENCES "user"("userid"),
--     FOREIGN KEY ("exerciseid") REFERENCES "routine"("routineid")

-- );

-- DROP TABLE IF EXISTS "set";
-- CREATE TABLE "set" (
--     "set_id" serial PRIMARY KEY,
--     "reps" smallint,
--     "weight" smallint,
--     "exerciseid" smallint NOT NULL,
--     "workoutid" smallint NOT NULL,
--     FOREIGN KEY ("exerciseid") REFERENCES "exercise"("exerciseid"),
--     FOREIGN KEY ("workoutid") REFERENCES "workout"("workoutid")
-- );

-- --TODO 
-- --write a ton of insert statements (wheeler maybe?)
