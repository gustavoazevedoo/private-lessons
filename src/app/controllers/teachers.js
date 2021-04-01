const { age, graduation, date } = require("../../lib/utils")
const Teacher = require("../models/Teacher")

module.exports = {
  index(req, res) {
    const { filter } = req.query

    if (filter) {
      Teacher.findBy(filter, (teachers) => {
        for (teacher of teachers) {
          teacher.subjects_taught = teacher.subjects_taught.split(",")
        }
        return res.render("teachers/index", { teachers, filter })
      })
    } else {
      Teacher.all((teachers) => {
        for (teacher of teachers) {
          teacher.subjects_taught = teacher.subjects_taught.split(",")
        }
        return res.render("teachers/index", { teachers })
      })
    }
  },
  create(req, res) {
    return res.render("teachers/create")
  },
  post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, complete all form")
      }
    }
  
    Teacher.create(req.body, (teacher) => {
      return res.redirect(`/teachers/${teacher.id}`)
    })
  },
  show(req, res) {
    Teacher.find(req.params.id, (teacher) => {
      teacher.age = age(teacher.birth_date)
      teacher.education_level = graduation(teacher.education_level)
      teacher.subjects_taught = teacher.subjects_taught.split(",")
      teacher.created_at = date(teacher.created_at).birthDay

      return res.render("teachers/show", { teacher })
    })
  },
  edit(req, res) {
    Teacher.find(req.params.id, (teacher) => {
      teacher.birth_date = date(teacher.birth_date).iso

      return res.render(`teachers/edit`, { teacher })
    })
  },
  update(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, complete all form")
      }
    }

    Teacher.update(req.body, () => {
      return res.redirect(`teachers/${req.body.id}`)
    })
  },
  delete(req, res) {
    Teacher.delete(req.body.id, () => {
      return res.redirect("teachers")
    })
  }
}