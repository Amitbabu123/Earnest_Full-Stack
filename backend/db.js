const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};