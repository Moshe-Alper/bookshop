'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elTableBody = document.querySelector('.book-list')

    const strHtml = getBooks().map(book => `
           <tr>
                <th scope="row">${book.title}</th>
                <td>${formatPrice(book.price)}</td>
                <td>
                    <button onclick="onReadBook('${book.id}')" class="read">Read</button>
                    <button onclick="onUpdateBook('${book.id}', 'title')" class="update-title">Update Title</button>
                    <button onclick="onUpdateBook('${book.id}', 'price')" class="update-price">Update Price</button>
                    <button onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
                </td>
            </tr>
        `)
    elTableBody.innerHTML = strHtml.join('')
}

function onReadBook(bookId) { //toggle model
    const elDetails = document.querySelector('.book-details')
    const elPre = document.querySelector('.book-details pre') 

    const book = getBookById(bookId)
    const bookInfo = `<h3>${book.title}<h3>\n<img src="img/${book.imgUrl}">`
    elPre.innerHTML = bookInfo
    elDetails.showModal()
}



function onUpdateBook(bookId, key) {
    const book = getBookById(bookId)
    const currValue = book[key]
    var value = prompt(`Current ${key}: ${currValue}. Update the book's ${key}:`)

    if (typeof book[key] === "number") {
        value = parseInt(value)
    }

    updateBook(bookId, key, value)
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook() {
    const title = prompt('Book title?')
    if (!title) return
    const price = +prompt('Book Price?')
    if (!price) return
    addBook(title, price)
    renderBooks()
}