const annoucements = require('express').Router()
const db = require('../utils/db')
const { authChecker } = require('../utils/middleware/index')

annoucements.post('/', authChecker, async (req, res) => {
  const {
    text,
    start_date,
    end_date,
    company_id,
  } = req.body

  const startDate = new Date(start_date).getTime()
  const endDate = new Date(end_date).getTime()

  if (startDate > endDate) {
    return res.status(401).send({ error: "Start date cannot be greater than end Date"})
  }

  db.run(
    "INSERT INTO announcements (text, start_date, end_date, company_id) VALUES (?, ?, ?, ?)", 
    [text, start_date, end_date, company_id]
  )

  const newAnnouncement = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM announcements WHERE company_id = ? ORDER BY id DESC", [company_id], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  res.status(200).send(newAnnouncement)
})

annoucements.get('/', authChecker, async (req, res) => {
  const { companyId } = req.query

  if(!companyId){
    res.status(401).send({error: "Company ID is required"})
  }

  const dateToday = new Date().toISOString().split('T')[0]

  const announcement = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM announcements WHERE company_id = ? AND ? between start_date AND end_date", [companyId, dateToday], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  res.status(200).send(announcement)
})

annoucements.delete('/:id', authChecker, async (req, res) => {
  const id = req.params.id

  const announcement = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM announcements WHERE id = ?;", [id], (err, existinAnnouncement) => {
      if (err){
        reject()
      } else {
        resolve(existinAnnouncement)
      }
    })
  })

  if(!announcement){
    res.status(404).send({ error: "Announcement not found"})
  }
  
  db.run(
    "DELETE FROM announcements WHERE id = ?", 
    [id]
  )
  
  res.status(200).send({ isCompleted: true})
})

module.exports = annoucements