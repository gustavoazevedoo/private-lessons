const { grade, date } = require("../../lib/utils")
const Student = require("../models/Student")

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query

    page = Number(page) || 1
    limit = 2
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {
        if (students[0]) {
          const pagination = {
            page,
            totalPages: Math.ceil(students[0].total / limit)
          }
          
          return res.render("students/index", { students, filter, pagination, grade })

        } else {
          return res.send("Student not found!")
        }
      }
    }

    Student.paginate(params)
  },
  create(req, res) {
    Student.teachersSelectOptions((options) => {
      return res.render("students/create", { teachersOptions: options })
    })
  },
  post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, complete all form")
      }
    }
  
    Student.create(req.body, (student) => {
      return res.redirect(`/students/${student.id}`)
    })
  },
  show(req, res) {
    Student.find(req.params.id, (student) => {
      student.birth_date = date(student.birth_date).birthDay
      student.grade = grade(student.grade)

      return res.render("students/show", { student })
    })
  },
  edit(req, res) {
    Student.find(req.params.id, (student) => {
      student.birth_date = date(student.birth_date).iso
      Student.teachersSelectOptions((options) => {
        return res.render(`students/edit`, { student, teachersOptions: options })
      })
    })
  },
  update(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, complete all form")
      }
    }

    Student.update(req.body, () => {
      return res.redirect(`students/${req.body.id}`)
    })
  },
  delete(req, res) {
    Student.delete(req.body.id, () => {
      return res.redirect("students")
    })
  }
}