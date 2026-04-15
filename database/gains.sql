
CREATE DATABASE gains;

DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
	"name" character varying(15),
	"surname" character varying(15),
    "age" smallint,
    "weight" smallint,
    "gender" char,
	"userid" smallint NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS "routine";
CREATE TABLE "routine" (
	"name" character varying(15),
	"type" character varying(15),
    "routineid" smallint NOT NULL PRIMARY KEY,
    "userid" smallint NOT NULL,
    FOREIGN KEY ("userid") REFERENCES "user"("userid")
);

DROP TABLE IF EXISTS "workout";
CREATE TABLE "workout" (
	"name" character varying(15),
	"workoutid" smallint NOT NULL PRIMARY KEY,
    "routineid" smallint NOT NULL,
    "userid" smallint NOT NULL,
    FOREIGN KEY ("userid") REFERENCES "user"("userid"),
    FOREIGN KEY ("routineid") REFERENCES "routine"("routineid")
);

DROP TABLE IF EXISTS "exercise";
CREATE TABLE "exercise" (
	"name" character varying(15),
    "muscle" character varying(15),
	"exerciseid" smallint NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS "workout_exercise";
CREATE TABLE "workout_exercise" (
	"workoutid" smallint NOT NULL,
	"exerciseid" smallint NOT NULL,
    FOREIGN KEY ("workoutid") REFERENCES "user"("userid"),
    FOREIGN KEY ("exerciseid") REFERENCES "routine"("routineid")

);

DROP TABLE IF EXISTS "set";
CREATE TABLE "set" (
    "set_id" serial PRIMARY KEY,
    "sets" smallint,
    "reps" smallint,
    "weight" smallint,
    "exerciseid" smallint NOT NULL,
    "workoutid" smallint NOT NULL,
    FOREIGN KEY ("exerciseid") REFERENCES "exercise"("exerciseid"),
    FOREIGN KEY ("workoutid") REFERENCES "workout"("workoutid")
);


INSERT INTO "user" VALUES ('jane', 'doe', 25, 150, 'F', 1);
INSERT INTO "routine" VALUES ('leg day', 'strength', 1, 1);
INSERT INTO "workout" VALUES ('squats', 1, 1, 1);
INSERT INTO "exercise" VALUES ('squat', 'legs', 1);
INSERT INTO "workout_exercise" VALUES (1, 1);
INSERT INTO "set" (sets, reps, weight, exerciseid, workoutid) VALUES (1, 10, 100, 1, 1);
--TODO 
--write a ton of insert statements (wheeler maybe?)