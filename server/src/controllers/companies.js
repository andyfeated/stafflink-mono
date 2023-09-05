const companies = require('express').Router()
const db = require('../utils/db')
const { authChecker } = require('../utils/middleware/index')

companies.get('/:id', authChecker, async (req, res) => {
  const id = req.params.id

  const company = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM companies WHERE id = ?;", [id], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(!company){
    res.status(404).send({ error: "Company not found"})
  }

  res.status(200).send(company)
})

companies.put('/:id', authChecker, async (req, res) => {
  const id = req.params.id
  const {
    name,
    websiteUrl,
  } = req.body

  const company = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM companies WHERE id = ?;", [id], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  if(!company){
    res.status(404).send({ error: "Company not found"})
  }

  db.run(
    "UPDATE companies SET name = ?, websiteUrl = ? WHERE id = ?", 
    [name, websiteUrl, id]
  )

  const updatedCompany = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM companies WHERE id = ?;", [id], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  res.status(200).send(updatedCompany)
})

module.exports = companies