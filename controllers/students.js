const fs = require("fs")
const data = require("../data.json")
const { date, grade } = require("../utils.js")

exports.index = (req, res) => {

  const students = data.students

  return res.render("students/index", { students }, grade())
}

exports.create = (req, res) => {
  return res.render("students/create")
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)
  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, complete all form")
    }
  }

  let { avatar_url, name, email, birth, grade, hours_week } = req.body

  birth = Date.parse(birth)
  const id = Number(data.students.length + 1)

  data.students.push({
    id,
    avatar_url,
    name,
    email,
    birth,
    grade,
    hours_week,
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error!")

    return res.redirect("/students")
  })
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundStudent = data.students.find((student) => {
    return id == student.id
  })
  if (!foundStudent) return res.send("Student not found")

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).birthDay,
    grade: grade(foundStudent.grade)
  }

  return res.render("students/show", { student })
}

exports.edit = (req, res) => {
  const { id } = req.params
  
  const foundStudent = data.students.find((student) => {
    return id == student.id
  })

  if(!foundStudent) return res.send("Student not found!")

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso,
  }

  return res.render("students/edit", { student })
}

exports.update = (req, res) => {
  const { id } = req.body

  let index = 0
  const foundStudent = data.students.find((student, foundIndex) => {
    if (id == student.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundStudent) return res.send("Student not found!")

  const student = {
    ...foundStudent,
    ...req.body,
    id: Number(req.body.id)
  }

  data.students[index] = student

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Update error!")

    return res.redirect(`/students/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredStudent = data.students.filter((student) => {
    return student.id != id
  })

  if(!filteredStudent) return res.send("Student not found")

  data.students = filteredStudent

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Delete student error!")

    return res.redirect("/students")
  })
}