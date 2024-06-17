'use strict'

function onInit() {
    renderBookList()
}

function renderBookList() {
    const elBookList = document.querySelector('.book-list')
    const strHtml = getBooks().map(book => `
           <tr>
                <th scope="row">${book.title}</th>
                <td>${book.price}</td>
                <td>
                    <button onclick="onReadBook('${book.id}')" class="read">Read</button>
                    <button onclick="onUpdateBook('${book.id}')" class="update">Update</button>
                    <button onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
                </td>
            </tr>
        `)
    elBookList.innerHTML = strHtml.join('')
}

function onReadBook(bookId) {
    console.log(bookId)
}

function onUpdateBook(bookId) {
    const book = getBooks().find(book => book.id === bookId)

    const newPrice = +prompt('Update the book price:', book.price)
    updatePrice(bookId, newPrice)
    renderBookList()
}

function onRemoveBook(bookId) {
    const idx = getBooks().findIndex(book => book.id === bookId)
    getBooks().splice(idx, 1)

    renderBookList()
}