const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
  all(callback) {
    db.query("SELECT * FROM my_teacher ORDER BY name ASC", (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  create(data, callback) {
    const query = `
      INSERT INTO my_teacher (
        avatar_url,
        name,
        birth_date,
        education_level,
        class_type,
        subjects_taught,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth_date).iso,
      data.education_level,
      data.class_type,
      data.subjects_taught,
      date(Date.now()).iso,
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    db.query(`SELECT * FROM my_teacher WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database Error ${err}`

      callback(results.rows[0])
    })
  },
  findBy(filter, callback) {
    db.query(`
    SELECT * FROM my_teacher 
    WHERE my_teacher.name ILIKE '%${filter}%'
    ORDER BY name ASC`, (err, results) => {
      if (err) throw `Database Error ${err}`

      callback(results.rows)
    })
  },
  update(data, callback) {
    const query = `
      UPDATE my_teacher SET
        avatar_url=($1),
        name=($2),
        birth_date=($3),
        education_level=($4),
        class_type=($5),
        subjects_taught=($6)
      WHERE id = $7
    `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth_date).iso,
      data.education_level,
      data.class_type,
      data.subjects_taught,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query("DELETE FROM my_teacher WHERE id = $1", [id], (err, results) => {
      if (err) throw `Database Error ${err}`

      callback()
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params

    let query = ``
    let filterQuery = ""
    let totalQuery = `(
      SELECT count(*) FROM my_teacher
    ) AS total`

    if (filter) {
      filterQuery =`
      WHERE my_teacher.name ILIKE '%${filter}%'
      OR my_teacher.subjects_taught ILIKE '%${filter}%'
      `
      totalQuery = `(
        SELECT count(*) FROM my_teacher
        ${filterQuery}
      ) AS total`
    }

    query = `
    SELECT my_teacher.*, ${totalQuery}, count(my_student) AS total_students
    FROM my_teacher
    LEFT JOIN my_student ON (my_teacher.id = my_student.teacher_id)
    ${filterQuery}
    GROUP BY my_teacher.id 
    ORDER BY my_teacher.name ASC
    LIMIT $1 OFFSET $2`

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw `Database Error ${err}`

      callback(results.rows)
    })
  }
}