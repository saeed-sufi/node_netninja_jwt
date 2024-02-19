const { pool } = require('../dbConfig')
const { isEmail, isStrongPassword } = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let errors = []
const checkCredentials = (email, password) => {

  if (!isEmail(email)) {
    errors.push({ message: "Please enter a valid email" })
  }

  const passwordOptions = {
    minLength: 3,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
    returnScore: false
  };

  if (!isStrongPassword(password, passwordOptions)) {
    errors.push({ message: "Password is not strong enough." })
  }
}
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja saeed pass', {
    expiresIn: maxAge
  })
}

module.exports.signup_get = (req, res) => {
  res.render('signup')
}
module.exports.login_get = (req, res) => {
  res.render('login')
}
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body
  checkCredentials(email, password)

  if (errors.length == 0) {
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
      const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword])
      const token = createToken(newUser.rows[0].id)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(201).json(newUser.rows[0].id)

    } catch (error) {
      errors.push({ message: "User registration failed!" })
      res.status(400).send(errors)
    }
  } else {
    res.status(400).send(errors)
  }
}
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await loginCheck(email, password)
    const token = createToken(user.rows[0].id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user.rows[0].id })

  } catch (err) {
    res.status(400).send('erororrororor')
  }
}

const isPasswordCorrect = async (user, password) => {
  return await bcrypt.compare(password, user.rows[0].password)
}

const loginCheck = async (email, password) => {
  const user = await pool.query('SELECT id, password FROM USERS WHERE email = $1', [email])
  if (user.rows.length) {
    if (await isPasswordCorrect(user, password)) {
      return user
    } else {
      throw Error('Password is incorrect.')
    }
  } else {
    throw Error('User does not exist.')
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}