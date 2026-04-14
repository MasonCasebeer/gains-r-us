//file: server.js
// USAFA CS 364 
// Lesson 27 Authentication example
 
const express = require("express");
const crypto = require('crypto');
const session = require("express-session");
const pool = require('./db');
const auth = require("./auth");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false} // would be set to true if using HTTPS
  })
);

// Route handler for GET /
app.get('/', (req, res) => {
  const currentTime = new Date().toString();
  res.send(`Current server time: ${currentTime}`);
});

// Route handler for GET /api/
app.get('/api/', (req, res) => {
  const currentTime = new Date().toString();
  res.send(`Current API time: ${currentTime}`);
});


// app.post("/api/register", auth.register);

const saltRounds = 10;


app.post("/api/register", async (req, res) => {

  console.log("server.js: register ");
  const { username, email, password, role } = req.body;

  console.log(`server.js: register username: ${username}`);
  console.log(`server.js: register email: ${email}`);
  console.log(`server.js: register password: ${password}`);
  console.log(`server.js: register role: ${role}`);

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  const query = 'INSERT INTO users (username, email, hash, salt, role) VALUES ($1, $2, $3, $4, $5) RETURNING userid';

  const values = [username, email, hash, salt, role];
  console.log("trying query with these values...");
  console.log(values);

  try {
    const result = await pool.query(query, values);
    console.log("user NOW registered ... going to respond");
    console.log(result);
    res.json({ success: true, message: `${role} account created`, username: `${username}` }); 
  } catch (error) {
    console.log("in catch block of server.js/register");
    console.log(error);
    res.json({ success: false, message: 'Username or email already exists.' });
  }
});


app.post("/api/login", auth.login);

app.get("/api/users", auth.ensureAdmin, async (req, res) => {
  console.log("in GET /users");
  const result = await pool.query("SELECT username, email, role FROM users");
  console.log(`GET /users rows: ${result.rows}`);
  res.json(result.rows);
});

app.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

app.get("/api/session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get("/api/user-workouts", async (req, res) => {
  const result = await pool.query(
    `
    SELECT DISTINCT username, email, role, users.userid FROM users
    LEFT JOIN workout ON users.userid = workout.userid
    `
  );
  console.log(`GET /users rows: ${result.rows}`);
  res.json(result.rows);
});

app.post("/api/log-workout", async (req, res) => {
  const { workoutData } = req.body;
  console.log("Received workout data:", workoutData);
  try {
    const result = await pool.query(
      `
      INSERT INTO workout (userid, routineid)
      VALUES ($1, $2)
      RETURNING workoutid
      `,
      [workoutData.userid, workoutData.routineid]
    );
    console.log(`Inserted workout with ID: ${result.rows[0].workoutid}`);
    res.json({ success: true, workoutId: result.rows[0].workoutid });
  } catch (error) {
    console.error("Error logging workout:", error);
    res.json({ success: false, message: "Error logging workout" });
  }
});

//added these so backend doesnt crash just cause call failed
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

app.listen(3000, () => console.log("Server running on port 3000"));
