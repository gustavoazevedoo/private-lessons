const fs = require("fs")
const data = require("./data.json")
const { age, graduation } = require("./utils.js")

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
    classes: foundTeacher.classes.split(","),
    created_at: Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
  }

  return res.render("teachers/show", { teacher })
}