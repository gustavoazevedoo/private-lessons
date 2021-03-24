module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp)

    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || month == 0 && today.getDate() <= birthDate.getDate()) {
      age = age - 1
    }
    return age
  },
  graduation(educationLevel) {
    switch (educationLevel) {
      case "high_school": return "Ensino médio completo"
      case "undergraduete": return "Ensino superior completo"
      case "master_degree": return "Mestrado"
      case "doctorate": return "Doutorado"
      default: break;
    }
  },
  date(timestamp) {
    const birth = new Date(timestamp)
    
    const year = birth.getUTCFullYear()
    const month = `0${birth.getUTCMonth() + 1}`.slice(-2)
    const day = `0${birth.getUTCDate()}`.slice(-2)

    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}/${year}`
    }
  },
  grade(grade) {
    switch (grade) {
      case "fifth-grade": return "5° ano"
      case "sixth-grade": return "6° ano"
      case "seventh-grade": return "7° ano"
      case "eighth-grade": return "8° ano"
      case "ninth-grade": return "9° ano"
      case "first-year_high-school": return "1° ano ensino médio"
      case "second-year_high-school": return "2° ano ensino médio"
      case "third-year_high-school": return "3° ano ensino médio"

      default: break;
    }
  }
}