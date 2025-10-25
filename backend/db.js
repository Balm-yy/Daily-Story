//backend/db.js

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();


//Configuration for PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST || 'postgres',
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});


const waitForPostgres = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Connecté à PostgreSQL");
      return;
    } catch (err) {
      console.log(`⏳ PostgreSQL non prêt (tentative ${i + 1}/${retries})`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error("❌ Impossible de se connecter à PostgreSQL après plusieurs essais.");
};

waitForPostgres();
/*
console.log("🧩 Variables BDD chargées :", {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD ? "***" : "❌ MDP manquant",
  port: process.env.PG_PORT,
});
*/

//Test the database connection immediately

pool.connect()
    .then(() => console.log("✅ dockerConnected to the PostgreSQL database successfully!"))
    .catch((err) => console.error("Database connection error:", err));

module.exports = pool;