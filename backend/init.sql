CREATE ROLE "developer" WITH LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE gains TO "developer";

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
	"userid" serial PRIMARY KEY
);

select * from "users";

DROP TABLE IF EXISTS "routine";
CREATE TABLE "routine" (
	"name" character varying(15),
	"type" character varying(15),
    "routineid" serial PRIMARY KEY,
    "userid" smallint NOT NULL,
    FOREIGN KEY ("userid") REFERENCES "users"("userid")
);

DROP TABLE IF EXISTS "workout";
CREATE TABLE "workout" (
	"name" character varying(15),
	"workoutid" serial PRIMARY KEY,
    "routineid" smallint NOT NULL,
    "userid" smallint NOT NULL,
    FOREIGN KEY ("userid") REFERENCES "users"("userid"),
    FOREIGN KEY ("routineid") REFERENCES "routine"("routineid")
);

DROP TABLE IF EXISTS "exercise";
CREATE TABLE "exercise" (
	"name" character varying(15),
    "muscle" character varying(15),
	"exerciseid" serial NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS "routine_exercise";
CREATE TABLE "routine_exercise" (
	"routineid" smallint NOT NULL,
	"exerciseid" smallint NOT NULL,
    FOREIGN KEY ("routineid") REFERENCES "routine"("routineid"),
    FOREIGN KEY ("exerciseid") REFERENCES "exercise"("exerciseid")

);

DROP TABLE IF EXISTS "set";
CREATE TABLE "set" (
    "set_id" serial PRIMARY KEY,
    "reps" smallint,
    "weight" smallint,
    "exerciseid" smallint NOT NULL,
    "workoutid" smallint NOT NULL,
    FOREIGN KEY ("exerciseid") REFERENCES "exercise"("exerciseid"),
    FOREIGN KEY ("workoutid") REFERENCES "workout"("workoutid")
);

INSERT INTO "users" (userid, username, email, hash, salt, role) 
VALUES (1, 'admin', 'admin@gmail,com', '5ae57bd0414728855fe98c51c642d1f1788f17d1ac56b7c351ff6fa2f70b1810a14a49a9b14ecfec865c4f95c8d55d25d2df7e18277de268aba990a4eb551d68', 'abe86680cdb058b5c404fc31bcaf9887', 'admin');

INSERT INTO "routine" VALUES ('leg day', 'strength', 1, 1);
INSERT INTO "exercise" VALUES ('Squat', 'Legs', 1);
INSERT INTO "exercise" VALUES ('Deadlift', 'Back', 2);
INSERT into "routine_exercise" VALUES (1, 1);
INSERT into "routine_exercise" VALUES (1, 2);