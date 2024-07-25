const { comparePassword } = require('../helpers/bcrypt')
const { User } = require('../models/')
const jwt = require('jsonwebtoken')

class Controller {
  static async register(req, res) {
    try {
      console.log(req.body, '<--- req.body')
      const { email, password } = req.body
      console.log(email, password, '<-- email, password')

      const newUser = await User.create({
        email, password
      })

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
      })
    } catch(err) {
      if(err.name === 'SequelizeValidationError') {
        res.status(400).json({
          message: err.errors[0].message
        })
      } else {
        res.status(500).json({
          message: "Internal Server Error"
        })
      }
    }
  }

  static async login(req, res) {
    try {
      // 1. Cek dulu ada email dan password - Kalo gk ada lempar error

      // 2. Kita cek. User dengan email yang dikasih itu. Ada atau tidak di db -  Kalo gk ketemu user nya lempar error

      // 3. Kita bandingkan password nya dengan password yang sudah di hash

      // 4. Kita buat token

      const { email, password } = req.body

      if(!email || !password) {
        throw { name: "CredentialsRequired" }
      }

      const foundUser = await User.findOne({
        where: {
          email
        }
      })

      if(!foundUser) {
        throw { name: "Unauthorized" }
      }

      const comparedPass = comparePassword(password, foundUser.password)

      if(!comparedPass) {
        throw { name: "Unauthorized" }
      }

      const access_token = jwt.sign({ id: foundUser.id }, 'secret')

      res.json({ access_token })
    } catch(err) {
      if(err.name === 'CredentialsRequired') {
        res.status(400).json({
          message: "Email and password is required"
        })
      } else if(err.name === 'Unauthorized') {
        res.status(401).json({
          message: "Email or password is invalid"
        })
      } else {
        res.status(500).json({
          message: "Internal Server Error"
        })
      }
    }
  }
}

module.exports = Controller