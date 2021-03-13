const express = require("express")
const routes = express.Router()
const teachers = require("./teachers")

routes.get("/", (req, res) => {
  return res.redirect("/teachers")
})

routes.get("/teachers", (req, res) => {
  return res.render("teachers/index")
})

routes.get("/teachers/create", (req, res) => {
  return res.render("teachers/create")
})

routes.get("/teachers/:id/edit", teachers.edit)

routes.get("/teachers/:id", teachers.show)

routes.get("/students", (req, res) => {
  return res.send("students")
})

routes.put("/teachers", teachers.update)

routes.delete("/teachers", teachers.delete)

routes.post("/teachers", teachers.post)


module.exports = routes