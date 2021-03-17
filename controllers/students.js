const fs = require("fs")
const data = require("../data.json")
const { age, graduation, date } = require("../utils.js")

exports.index = (req, res) => {
  const students = data.students

  for (const student of students) {
    student.classes = student.classes.toString().split(",")
  }

  return res.render("students/index", { students })
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

  let { avatar_url, name, birth, education_level, type_class, classes } = req.body

  birth = Date.parse(birth)
  const created_at = Date.now()
  const id = Number(data.students.length + 1)

  data.students.push({
    id,
    avatar_url,
    name,
    birth,
    education_level,
    type_class,
    classes,
    created_at
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error!")

    return res.redirect("/students")
  })
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundTeacher = data.students.find((student) => {
    return id == student.id
  })
  if (!foundTeacher) return res.send("Teacher not found")

  const student = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    education_level: graduation(foundTeacher.education_level),
    classes: foundTeacher.classes.toString().split(","),
    created_at: Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
  }

  return res.render("students/show", { student })
}

exports.edit = (req, res) => {
  const { id } = req.params
  
  const foundTeacher = data.students.find((student) => {
    return id == student.id
  })

  if(!foundTeacher) return res.send("Teacher not found!")

  const student = {
    ...foundTeacher,
    birth: date(foundTeacher.birth)
  }

  return res.render("students/edit", { student })
}

exports.update = (req, res) => {
  const { id } = req.body

  let index = 0
  const foundTeacher = data.students.find((student, foundIndex) => {
    if (id == student.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundTeacher) return res.send("Teacher not found!")

  const student = {
    ...foundTeacher,
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

  const filteredTeacher = data.students.filter((student) => {
    return student.id != id
  })

  if(!filteredTeacher) return res.send("Teacher not found")

  data.students = filteredTeacher

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Delete student error!")

    return res.redirect("/students")
  })
}