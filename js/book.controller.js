'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elTableBody = document.querySelector('.book-list')

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
    elTableBody.innerHTML = strHtml.join('')
}

function onReadBook(bookId) {
    console.log(bookId)
}

function onUpdateBook(bookId) {
   
    updatePrice(bookId)
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBookList()
}

function onAddBook() {
    console.log('hi');
}