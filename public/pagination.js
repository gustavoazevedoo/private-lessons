function paginate(selectedPage, totalPages) {
  let pages = []
  let oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    // const lastTwoPages = currentPage == totalPages || currentPage == totalPages - 1
    const lastTwoPages = currentPage > totalPages - 2
  
    const firstTwoAndLastTwoPages = currentPage <=2 || lastTwoPages
    const pageAfterSelectedPage = currentPage == selectedPage + 1 || currentPage == selectedPage
    const pageBeforeSelectedPage = currentPage == selectedPage - 1
  
    if (totalPages > 7) {
      if (firstTwoAndLastTwoPages || pageBeforeSelectedPage || pageAfterSelectedPage ) {
        
        if (oldPage && currentPage - oldPage > 2) {
          pages.push("...")
        }
        
        if (oldPage && currentPage - oldPage == 2) {
          pages.push(oldPage + 1)
        }
    
        pages.push(currentPage)
    
        oldPage = currentPage
      }
    } else {
      pages.push(currentPage)
    }
  }
  
  return pages
}

const pagination = document.querySelector(".pagination")
const page = Number(pagination.dataset.page)
const totalPages = Number(pagination.dataset.total)
const pages = paginate(page, totalPages)
const filter = pagination.dataset.filter

let elements = ""

for (let page of pages) {
  if (String(page).includes("...")) {
    elements += `<span>${page}</span>`
  } else {
    if (filter) {
      elements += `<a href=?page=${page}&filter=${filter}>${page}</a>`
    } else {
      elements += `<a href=?page=${page}>${page}</a>`
    }
  }
}

pagination.innerHTML = elements