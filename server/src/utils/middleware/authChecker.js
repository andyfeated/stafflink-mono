const jwt = require('jsonwebtoken')

const authChecker = (req, res, next) => {
  const token = req.headers.authorization
  const decodedToken = jwt.decode(token)

  if (!token) {
    return res.send({ error: "Forbidden"})
  }

  if (Date.now() >= decodedToken?.exp * 1000) {
    return res.send({ error: "Token is Expired"})
  }
  
  next()
}

module.exports = authChecker