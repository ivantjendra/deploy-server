const jwt = require("jsonwebtoken")

const secret = process.env.SECRET || "secret"
console.log(secret)

const signToken = (payload) => {
  console.log(secret, 'NNNNNNNN<< ini secret')
  return jwt.sign(payload, secret)
}

module.exports = { signToken }