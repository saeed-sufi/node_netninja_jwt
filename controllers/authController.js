const { pool } = require('../dbConfig')
const { isEmail, isStrongPassword } = require('validator')
const bcrypt = require('bcrypt')

let errors = []
const checkCredentials = (email, password) => {

  if (!isEmail(email)) {
    errors.push({ message: "Please enter a valid email" })
  }

  const options = {
    minLength: 3,         
    minLowercase: 0,     
    minUppercase: 0,    
    minNumbers: 1,       
    minSymbols: 0,        
    returnScore: false
  };

  if (!isStrongPassword(password, options)) {
    errors.push({ message: "Password is not strong enough." })
  }
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
      const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword])
      res.status(201).json(newUser.rows[0])

    } catch (error) {
      errors.push({message: "User registration failed!"})
      res.status(400).send(errors)
    }
  } else {
    res.status(400).send(errors)
  }
}
module.exports.login_post = (req, res) => {
  const { email, password } = req.body
  res.send('user login_post')
}