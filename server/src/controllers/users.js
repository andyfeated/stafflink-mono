const users = require('express').Router()
const db = require('../utils/db')
const bcrypt = require('bcrypt')

users.post('/', async (req, res) => {
  const {
    companyEmail,
    companyName,
    websiteUrl,
    firstName,
    lastName,
    phone,
    password,
  } = req.body

  const existingCompany = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM companies WHERE name = ?;", [companyName], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(existingCompany){
    return res.status(400).json({ error: "Company already exists "})
  }

  db.run("INSERT INTO companies (name, websiteUrl) VALUES (?, ?)", [companyName, websiteUrl])

  const newCompany = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM companies WHERE name = ?;", [companyName], (err, newComp) => {
      if (err){
        reject()
      } else {
        resolve(newComp)
      }
    })
  })

  const existingEmail = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE email = ?;", [companyEmail], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(existingEmail){
    return res.status(400).json({ error: "Employee already exists "})
  }
  
  const password_hash = await bcrypt.hash(password, 10)

  db.run(
    "INSERT INTO employees (first_name, last_name, email, role, password_hash, phone, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [firstName, lastName, companyEmail, 'hrManager', password_hash, phone, newCompany.id]
  )

  const newEmployee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE email = ?;", [companyEmail], (err, newEmp) => {
      if (err){
        reject()
      } else {
        resolve(newEmp)
      }
    })
  })

  return res.status(201).json({ newEmployee })
})

module.exports = users