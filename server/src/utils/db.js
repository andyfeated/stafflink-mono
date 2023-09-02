const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./stafflink_database.db', (err) => {
  if (err) {
    console.log(`Error running database: ${err}`)
  } else {
    db.run('CREATE TABLE companies(\
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
      name TEXT NOT NULL,\
      websiteUrl TEXT NOT NULL\
    )', (err) => {
      if (err) {
        console.log("Companies Table already exists")
      }
    })

    
    db.run('CREATE TABLE employees( \
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
      last_name TEXT  NOT NULL,\
      first_name TEXT  NOT NULL,\
      title TEXT,\
      department TEXT,\
      email TEXT,\
      phone TEXT,\
      role TEXT,\
      manager_id INTEGER,\
      password_hash TEXT,\
      company_id INTEGER,\
      FOREIGN KEY(company_id) REFERENCES company(id)\
    )', (err) => {
      if (err) {
        console.log("Employees Table already exists")
      }
    })

  }
})

module.exports = db