const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
  all(callback) {
    db.query("SELECT * FROM my_student ORDER BY name ASC", (err, results) => {
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
        hours_week,
        teacher_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth_date).iso,
      data.grade,
      data.hours_week,
      data.teacher
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    db.query(`
      SELECT my_student.*, my_teacher.name AS teacher_name
      FROM my_student
      LEFT JOIN my_teacher ON (my_student.teacher_id = my_teacher.id)  
      WHERE my_student.id = $1`, [id], (err, results) => {
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
        hours_week=($6),
        teacher_id=($7)
      WHERE id = $8
    `

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth_date).iso,
      data.grade,
      data.hours_week,
      data.teacher,
      data.id,
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
  },
  teachersSelectOptions(callback) {
    db.query(`SELECT name, id FROM my_teacher`, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }
}