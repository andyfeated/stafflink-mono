const attendance = require('express').Router()
const db = require('../utils/db')
const { authChecker } = require('../utils/middleware/index')

attendance.get('/hasTimedIn/:id', authChecker, async (req, res) => {
  const id = req.params.id

  const dateToday = new Date().toISOString().split('T')[0]

  const attendance = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM attendance WHERE employee_id = ? AND date = ?", [id, dateToday], (err, existinAnnouncement) => {
      if (err){
        reject()
      } else {
        resolve(existinAnnouncement)
      }
    })
  })

  res.status(200).send({ hasTimedIn: !!attendance })
})

attendance.post('/timeIn/:employeeId', authChecker, async (req, res) => {
  const empId = req.params.employeeId
  const { companyId } = req.body

  const dateToday = new Date().toISOString().split('T')[0]

  const existingAttendance = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM attendance WHERE employee_id = ? AND date = ?", [empId, dateToday], (err, existinAnnouncement) => {
      if (err){
        reject()
      } else {
        resolve(existinAnnouncement)
      }
    })
  })

  if(existingAttendance){
    res.status(401).send("Already timed in")
  }

  db.run(
    "INSERT INTO attendance (date, employee_id, company_id) VALUES (?, ?, ?)", 
    [dateToday, empId, companyId]
  )

  res.status(200).send({ isCompleted: true })
})

attendance.get('/', authChecker, async (req, res) => {
  const { companyId } = req.query

  const dateToday = new Date().toISOString().split('T')[0]

  const employees = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM employees WHERE company_id = ? AND role = 'employee';", [companyId], (err, existingComp) => {
      if (err){
        reject()
      } else {
        resolve(existingComp)
      }
    })
  })

  const mappedEmployees = []

  for (const emp of employees) {
    const attendance = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM attendance WHERE company_id = ? AND employee_id = ? AND date = ?;", [companyId, emp.id, dateToday], (err, existingComp) => {
        if (err){
          reject()
        } else {
          resolve(existingComp)
        }
      })
    })

    mappedEmployees.push({...emp, hasTimedIn: !!attendance})
  }

  res.status(200).send(mappedEmployees)
})

module.exports = attendance