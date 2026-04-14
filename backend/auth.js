//file: auth.js
// USAFA CS 364 
// Lesson 27 Authentication example
// Server-side authentication 
 
const crypto = require("crypto");
const db = require("./db");

const hashLength = 64;
const numHashIterations = 1000; 
// The iteration count 1000 is very low by modern standards. 
// In real systems, values like 100,000 are more common to better resist brute-force attacks.

const saltLength = 16;


async function login(req, res) {
  const { username, password } = req.body;
  console.log(`auth login username ${username}`);
  console.log(`auth login password ${password}`);
  const user = (await db.query("SELECT * FROM users WHERE username = $1", [username])).rows[0];
  if (!user) return res.status(401).json({ message: "Login failUre" });

  const hash = crypto.pbkdf2Sync(password, user.salt, numHashIterations, hashLength, "sha512").toString("hex");
  if (hash !== user.hash) return res.status(401).json({ message: "Login fAilure"});

  console.log(`making session: ${user.username}, ${user.role}`);
  req.session.user = { username: user.username, role: user.role };
  res.json({ message: "Logged in" });
}

async function register(req, res) {
  console.log("server.js: register ");
  const { username, email, password, role } = req.body;

  console.log(`server.js: register username: ${username}`);
  console.log(`server.js: register email: ${email}`);
  console.log(`server.js: register password: ${password}`);
  console.log(`server.js: register role: ${role}`);

  const salt = crypto.randomBytes(saltLength).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, numHashIterations, hashLength, "sha512").toString("hex");

  const query = 'INSERT INTO users (username, email, hash, salt, role) VALUES ($1, $2, $3, $4, $5) RETURNING id';

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
}

function ensureAdmin(req, res, next) {
  console.log("checking authorization ... ");
  console.log(`${req.session.user}`);
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

const fs = require("fs");
const path = require("path");

async function resetDatabase(req, res) {
  console.log("Attempting DB reset...");

  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Not allowed in production" });
  }

  try {
    // drop all tables
    await db.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    console.log("All tables dropped");

    // run init.sql
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    await db.query(sql);

    console.log("init.sql executed");

    res.json({ success: true, message: "Database reset successful" });

  } catch (err) {
    console.error("Reset failed:", err);
    res.status(500).json({ success: false, message: "Reset failed" });
  }
}

//module.exports = { register, login, ensureAdmin, resetDatabase };
module.exports = { login, ensureAdmin, resetDatabase };