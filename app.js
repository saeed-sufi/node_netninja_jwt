const express = require('express');
const authRoutes = require('./routes/authRoutes')
const { pool, createStoreTable } = require('./dbConfig')
const cookieParser = require('cookie-parser')
const {requireAuth}= require('./middleware/authMiddleware')
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

pool.connect((err, data) => {
  if (err) { throw new Error }
  else {
    createStoreTable()
    app.listen(3000)
    console.log('listening on port 3000...')
  }
})
// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)