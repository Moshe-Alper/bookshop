'use strict'

const LAYOUT_KEY = 'layoutDB'

var gQueryOptions = {
    filterBy: { title: '', rating: 0 },
    sortBy: {},
    page: { idx: 0, size: 5 }
}

var gLayout = loadFromStorage(LAYOUT_KEY) || 'table'
var gBookToEdit = null

function onInit() {
    readQueryParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks(gQueryOptions)

    if (gLayout === 'table') renderBooksTable(books)
    else renderBooksCards(books)

    renderStats()
}

function renderBooksTable(books) {
    const elTableBody = document.querySelector('.book-list')

    if (!books.length) {
        elTableBody.innerHTML = `<tr>
        <td colspan="4">No matching books were found...</td>
        </tr>`
        return
    }
    const strHTMLs = books.map(book => `
           <tr>
                <th scope="row">${book.title}</th>
                <td>${formatPrice(book.price)}</td>
                <td>${generateStarIcons(book.rating)}</td>
                <td>
                    <button onclick="onReadBook('${book.id}')" class="read">Read</button>
                    <button onclick="onUpdateBook('${book.id}')" class="update">Update</button>
                    <button onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
                </td>
            </tr>
        `)

    document.querySelector(".cards-container ").style.display = 'none'

    elTableBody.innerHTML = strHTMLs.join('')
    document.querySelector("table").style.display = 'table'
}

function renderBooksCards(books) {
    const elCardsContainer = document.querySelector('.cards-container')
    const strHTMLs = books.map(book => `<article class="card-preview">
                <img src="img/${book.imgUrl}" alt="${book.title}" />
                <h4>${book.title}</h4>
                <span>${generateStarIcons(book.rating)}</span>
                <p>${makeLorem(20)}</p>
                <h5>${formatPrice(book.price)}<h5>
                <button onclick="onReadBook('${book.id}')" class="read">Read</button>
                <button onclick="onUpdateBook('${book.id}')" class="update">Update</button>
                <button onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
            </article>          
            `)
    document.querySelector("table").style.display = 'none'

    elCardsContainer.innerHTML = strHTMLs.join('')
    document.querySelector(".cards-container ").style.display = "flex"
}

function onRemoveBook(bookId) {
    if (!confirm('Are you sure you want to delete book?')) return
    removeBook(bookId)
    flashMsg('Book Deleted')
    renderBooks()
}

function onSetLayout(layout) {
    gLayout = layout
    saveToStorage(LAYOUT_KEY, gLayout)
    renderBooks()
}

function onReadBook(bookId) {
    const elDetails = document.querySelector('.book-details')
    const book = getBookById(bookId)

    elDetails.querySelector(".book-cover-img img").src = `img/${book.imgUrl}`
    elDetails.querySelector(".book-desc h3").innerText = book.title
    elDetails.querySelector(".book-desc p").innerText = book.desc
    elDetails.querySelector(".rate").innerText = book.rating

    elDetails.dataset.bookId = bookId

    elDetails.showModal()
}


// function onUpdateBook(bookId, key) {
//     const book = getBookById(bookId)
//     const currValue = book[key]
//     var value = prompt(`Current ${key}: ${currValue}. Update the book's ${key}:`)

//     if (!value || currValue === value) return

//     if (typeof book[key] === 'number') {
//         value = parseInt(value)
//     }

//     updateBook(bookId, key, value)
//     flashMsg('Updated')
//     renderBooks()
// }

function onUpdateBook(bookId) {
    resetBookEditModal()

    const elModal = document.querySelector('.book-edit-modal')
    const elForm = document.querySelector('.book-edit-modal form')

    const elTitle = elForm.querySelector("input[name=book-title]")
    const elPrice = elForm.querySelector("input[name=book-price]")

    const book = getBookById(bookId)
    elTitle.value = book.title
    elPrice.value = book.price

    gBookToEdit = book
    elModal.showModal()
}

function onAddBook() {
    gBookToEdit = null
    resetBookEditModal()
    const elModal = document.querySelector('.book-edit-modal')
    elModal.showModal()
}

function onSaveBook() {
    const elForm = document.querySelector('.book-edit-modal form')

    const elTitle = elForm.querySelector("input[name=book-title]")
    const elPrice = elForm.querySelector("input[name=book-price]")

    const title = elTitle.value
    const price = parseFloat(elPrice.value)


    if (!title || isNaN(price)) {
        flashMsg("Please enter a valid title and price.")
        return
    }

    if (gBookToEdit) {
        var book = updateBook(gBookToEdit.id, title, price)
        flashMsg(`${book.title} Updated`)

    } else {
        var book = addBook(title, price)
        flashMsg(`${book.title} Added`)

    }

    gBookToEdit = null

    resetBookEditModal()
    renderBooks()
}

function resetBookEditModal() {
    const elForm = document.querySelector('.book-edit-modal form')
    elForm.querySelector('input[name=book-title]').value = ''
    elForm.querySelector('input[name=book-price]').value = ''

}

function onCloseBookEditModal() {
    document.querySelector('.book-edit-modal').close()

    resetBookEditModal()
}


function renderStats() {
    const elStats = document.querySelector('footer .stats')

    const elExpensive = elStats.querySelector('.expensive')
    const elAverage = elStats.querySelector('.average')
    const elCheap = elStats.querySelector('.cheap')

    const { expensive, average, cheap } = getStats()

    elExpensive.innerText = expensive
    elAverage.innerText = average
    elCheap.innerText = cheap
}


function onUpdateRating(ev, diff) {
    ev.preventDefault()
    const elDetails = document.querySelector(".book-details")

    const bookId = elDetails.dataset.bookId
    const book = updateRating(bookId, +diff)
    elDetails.querySelector(".rate").innerText = book.rating
}

function onSetFilterBy(filterBy) {
    if (filterBy.title !== undefined) {
        gQueryOptions.filterBy.title = filterBy.title
    } else if (filterBy.rating !== undefined) {
        gQueryOptions.filterBy.rating = filterBy.rating
    }
    setQueryParams()
    renderBooks()
}

function onResetFilter() {
    gQueryOptions.filterBy = { title: '', rating: 0 }
    const elForm = document.querySelector('.filter form')
    elForm.querySelector('input[name="by-title"]').value = gQueryOptions.filterBy.title
    elForm.querySelector(('select[name="by-rating"]')).value = gQueryOptions.filterBy.rating
    renderBooks()

}

function onSetSortBy() {
    const elSortField = document.querySelector('.sort select') || { value: 'defaultField' }
    const elSortDir = document.querySelector('input[name="sortOrder"]:checked')  || { value: 'ascending' }

    const sortField = elSortField.value
    const sortDir = (elSortDir.value === 'ascending') ? 1 : -1

    gQueryOptions.sortBy = { [sortField]: sortDir}
    console.log('gQueryOptions.sortBy:', gQueryOptions.sortBy)

    renderBooks()
}

function onSetSort(sortField, isAscending) {
    const sortDir = isAscending ? 1 : -1

    gQueryOptions.sortBy = { [sortField]: sortDir}

    renderBooks()
}

function onNextPage() {
    const pageCount = getPageCount(gQueryOptions)

    if (gQueryOptions.page.idx === pageCount -1) {
        gQueryOptions.page.idx = 0
    } else {
        gQueryOptions.page.idx++
    }

    renderBooks()
}

function onPrevPage() {
    const pageCount = getPageCount(gQueryOptions)

    if (gQueryOptions.page.idx === 0) {
        gQueryOptions.page.idx = pageCount - 1
    } else {
        gQueryOptions.page.idx--
    }

    renderBooks()
}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('title', gQueryOptions.filterBy.title)
    queryParams.set('rating', gQueryOptions.filterBy.rating)

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    if (sortKeys.length) {
        queryParams.set('sortBy', sortKeys[0])
        queryParams.set('sortDir', gQueryOptions.sortBy[sortKeys[0]])
    }

    if (gQueryOptions.page) {
        queryParams.set('pageIdx', gQueryOptions.page.idx)
        queryParams.set('pageSize', gQueryOptions.page.size)
    }

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    gQueryOptions.filterBy = {
        title: queryParams.get('title') || '',
        rating: +queryParams.get('rating') || ''
    }

    if (queryParams.get('sortBy')) {
        const prop = queryParams.get('sortBy')
        const dir = queryParams.get('sortDir')
        gQueryOptions.sortBy[prop] = dir
    }

    if (queryParams.get('pageIdx')) {
        gQueryOptions.page.idx = +queryParams.get('pageIdx')
        gQueryOptions.page.size = +queryParams.get('pageSize')
    }

    renderQueryParams()
}

function renderQueryParams() {
    const elForm = document.querySelector('.filter form')
    elForm.querySelector('input[name="by-title"]').value = gQueryOptions.filterBy.title
    elForm.querySelector(('select[name="by-rating"]')).value = gQueryOptions.filterBy.rating

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    const sortBy = sortKeys[0]
    // console.log('sortBy:', sortBy)
    const dir = gQueryOptions.sortBy[sortKeys[0]]
    // console.log('dir:', dir)

    document.querySelector('.sort select').value = sortBy || ''
    document.querySelector('.sort input').checked = (dir === '-1') ? true : false

}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => el.classList.remove('open'), 2000)
}