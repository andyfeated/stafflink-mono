const config = require('../utils/config')
const loginRouter = require('express').Router()
const db = require('../utils/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const employee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE email = ?;", [email], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  const passwordCorrect = await bcrypt.compare(password, employee.password_hash);

  if(!passwordCorrect) {
    return res.status(401).send({ error: 'Incorrect password' })
  }

  const employeeForToken = {
    id: employee.id,
    email: employee.email,
  }

  const token = jwt.sign(employeeForToken, config.JWT_SECRET, { expiresIn: '2d' })

  res.status(200).send({
    token,
    email: employee.email,
    name: `${employee['first_name']} ${employee['last_name']}`,
    id: employee.id,
    role: employee.role,
    companyId: employee.company_id
  })
})

module.exports = loginRouter