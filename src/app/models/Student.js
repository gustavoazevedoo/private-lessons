const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
  all(callback) {
    db.query("SELECT * FROM my_student", (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  create(data, callback) {
    const query = `
      INSERT INTO my_student (
        avatar_url,
        name,
        email,
        birth_date,
        grade,
        hours_week
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth_date).iso,
      data.grade,
      data.hours_week,
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    db.query(`SELECT * FROM my_student WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database Error ${err}`

      callback(results.rows[0])
    })
  },
  update(data, callback) {
    const query = `
      UPDATE my_student SET
        avatar_url=($1),
        name=($2),
        email=($3),
        birth_date=($4),
        grade=($5),
        hours_week=($6)
      WHERE id = $7
    `

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth_date).iso,
      data.grade,
      data.hours_week,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query("DELETE FROM my_student WHERE id = $1", [id], (err, results) => {
      if (err) throw `Database Error ${err}`

      callback()
    })
  }
}