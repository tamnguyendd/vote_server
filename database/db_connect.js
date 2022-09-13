require('dotenv').config()
// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  //port: process.env.PORT,
});
module.exports = pgClient;