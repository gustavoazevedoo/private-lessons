const fs = require("fs")
const data = require("../data.json")
const { age, graduation, date } = require("../utils.js")

exports.index = (req, res) => {
  const teachers = data.teachers

  for (const teacher of teachers) {
    teacher.classes = teacher.classes.toString().split(",")
  }

  return res.render("teachers/index", { teachers })
}

exports.create = (req, res) => {
  return res.render("teachers/create")
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
  const id = Number(data.teachers.length + 1)

  data.teachers.push({
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

    return res.redirect("/teachers")
  })
}

exports.show = (req, res) => {
  const { id } = req.params
  const foundTeacher = data.teachers.find((teacher) => {
    return id == teacher.id
  })
  if (!foundTeacher) return res.send("Teacher not found")

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    education_level: graduation(foundTeacher.education_level),
    classes: foundTeacher.classes.toString().split(","),
    created_at: Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
  }

  return res.render("teachers/show", { teacher })
}

exports.edit = (req, res) => {
  const { id } = req.params
  
  const foundTeacher = data.teachers.find((teacher) => {
    return id == teacher.id
  })

  if(!foundTeacher) return res.send("Teacher not found!")

  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth)
  }

  return res.render("teachers/edit", { teacher })
}

exports.update = (req, res) => {
  const { id } = req.body

  let index = 0
  const foundTeacher = data.teachers.find((teacher, foundIndex) => {
    if (id == teacher.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundTeacher) return res.send("Teacher not found!")

  const teacher = {
    ...foundTeacher,
    ...req.body,
    id: Number(req.body.id)
  }

  data.teachers[index] = teacher

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Update error!")

    return res.redirect(`/teachers/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredTeacher = data.teachers.filter((teacher) => {
    return teacher.id != id
  })

  if(!filteredTeacher) return res.send("Teacher not found")

  data.teachers = filteredTeacher

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Delete teacher error!")

    return res.redirect("/teachers")
  })
}