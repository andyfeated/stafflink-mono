const users = require('express').Router()
const db = require('../utils/db')
const bcrypt = require('bcrypt')
const { authChecker } = require('../utils/middleware/index')

users.post('/register', async (req, res) => {
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

users.get('/:id', authChecker, async (req, res) => {
  const id = req.params.id

  const employee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE id = ?;", [id], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(!employee){
    res.status(404).send({ error: "Employee not found"})
  }

  res.status(200).send(employee)
})

users.get('/', authChecker, async (req, res) => {
  const { companyId } = req.query
  
  if(!companyId){
    res.status(401).send({error: "Company ID is required"})
  }

  const employees = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM employees WHERE company_id = ?", [companyId], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })
  
  res.status(200).send(employees)
})

users.put('/:id', authChecker, async (req, res) => {
  const id = req.params.id
  const {
    email,
    title,
    department,
    firstName,
    lastName,
    phone,
    role,
  } = req.body

  const employee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE id = ?;", [id], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(!employee){
    res.status(404).send({ error: "Employee not found"})
  }
  
  db.run(
    "UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, title = ?, department = ?, role = ? WHERE id = ?", 
    [firstName, lastName, email, phone, title, department, role || employee.role, id]
  )
  
  const updatedEmployee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE id = ?;", [id], (err, newEmp) => {
      if (err){
        reject()
      } else {
        resolve(newEmp)
      }
    })
  })

  res.status(200).send(updatedEmployee)
})

users.post('/', authChecker, async (req, res) => {
  const {
    email,
    title,
    department,
    firstName,
    lastName,
    phone,
    role,
    companyId,
    password
  } = req.body

  const existingCompany = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM companies WHERE id = ?;", [companyId], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(!existingCompany){
    return res.status(400).json({ error: "Company does not exists "})
  }

  const existingEmail = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE email = ?;", [email], (err, existingComp) => {
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
    "INSERT INTO employees (first_name, last_name, email, role, phone, company_id, title, department, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [firstName, lastName, email, role, phone, companyId, title, department, password_hash]
  )

  const newEmployee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE email = ?;", [email], (err, newEmp) => {
      if (err){
        reject()
      } else {
        resolve(newEmp)
      }
    })
  })

  res.status(200).send(newEmployee)
})

users.delete('/:id', authChecker, async (req, res) => {
  const id = req.params.id

  const employee = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM employees WHERE id = ?;", [id], (err, existingEmp) => {
      if (err){
        reject()
      } else {
        resolve(existingEmp)
      }
    })
  })

  if(!employee){
    res.status(404).send({ error: "Employee not found"})
  }
  
  db.run(
    "DELETE FROM employees WHERE id = ?", 
    [id]
  )
  
  res.status(200).send({ isCompleted: true})
})

module.exports = users