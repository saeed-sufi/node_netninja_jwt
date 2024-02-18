require("dotenv").config()
const { Pool } = require('pg')

// database connection
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({ connectionString })

const createStoreTable = async () => {
  try {
    await pool.query(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, email VARCHAR (255) UNIQUE NOT NULL, password VARCHAR (255) UNIQUE NOT NULL )')
  } catch (error) {
    throw (error)
  }
}
// createStoreTable()
module.exports = { pool, createStoreTable }