const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "qr_ticketing",
  password: "Madhu@44413",
  port: 5432,
});

module.exports = pool;
