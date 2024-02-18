const { pool } = require('../dbConfig')
const { isEmail } = require('validator')

let errors = []
const handleErrors = (email, password) => {
  
  if (!isEmail(email)) {
    errors.push({message: "Please enter a valid email"})
  }

  if (password.length < 3) {
    errors.push({message: "Password should be at least 3 characters."})
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
  
  try {
    const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password])
    res.status(201).json(newUser.rows[0])

  } catch (error) {
    res.status(400).send('error, user not created!')
  }

}
module.exports.login_post = (req, res) => {
  const { email, password } = req.body
  res.send('user login_post')
}