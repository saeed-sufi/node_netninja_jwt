const express = require('express');
require("dotenv").config()
const { Pool } = require('pg')
const app = express();

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

// database connection
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString
})

const createStoreTable = async () => {
  try {
    await pool.query(
      'CREATE TABLE IF NOT EXISTS store (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR (255) NOT NULL, slug VARCHAR (255) UNIQUE NOT NULL, description VARCHAR (1000), tags TEXT [], location POINT, address VARCHAR (1000))')
  } catch (error) {
    throw (error)
  }
}

pool.connect((err, data) => {
  if (err) { throw new Error }
  else {
    // createStoreTable()
    app.listen(3000)
    console.log('listening on port 3000...')
  }
})
// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));