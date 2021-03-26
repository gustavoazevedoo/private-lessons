const { age, grade, date } = require("../../lib/utils")
const Student = require("../models/Student")

module.exports = {
  index(req, res) {
    Student.all((students) => {
      return res.render("students/index", { students, grade })
    })
  },
  create(req, res) {
    return res.render("students/create")
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

      return res.render(`students/edit`, { student })
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