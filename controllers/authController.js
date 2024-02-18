const { pool } = require('../dbConfig')
const { isEmail, isStrongPassword } = require('validator')

let errors = []
const checkCredentials = (email, password) => {

  if (!isEmail(email)) {
    errors.push({ message: "Please enter a valid email" })
  }

  // Options for password strength (customize as needed)
  const options = {
    minLength: 3,          // Minimum length of the password
    minLowercase: 0,       // Minimum number of lowercase characters
    minUppercase: 0,       // Minimum number of uppercase characters
    minNumbers: 1,         // Minimum number of numeric characters
    minSymbols: 0,         // Minimum number of special characters
    returnScore: false,    // If true, returns an object with a score property
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
    try {
      const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password])
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