const jwt = require('jsonwebtoken')
const { pool } = require('../dbConfig')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, 'net ninja saeed pass', (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.redirect('/login')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, 'net ninja saeed pass', async (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.locals.user = null
        next()
      } else {
        const user = await pool.query('SELECT email FROM users WHERE id = $1', [decodedToken.id])
        res.locals.user = user.rows[0]
        next()
      }
    })
  } else {
    res.locals.user = null 
    next()
  }
}

module.exports = { requireAuth , checkUser}