'use strict'

var gBooks = []

_createBooks()

function getBooks() {
    return gBooks
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function updatePrice(bookId) {
    const book = getBooks().find(book => book.id === bookId) 
    const newPrice = +prompt('Update the book price:', book.price)
    const bookIdx = gBooks.findIndex(book => book.id == bookId)
    gBooks[bookIdx].price = newPrice
}

function removeBook(bookId) {
    const idx = getBooks().findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
}

function addBook(title, price) {
    const book = {
        id: 'tr4r4r',
        title: title,
        price: price,
        imgUrl: 'book-cover-placeholder.png'
    }
    gBooks.unshift(book)
    return book
}

function _createBooks() {
    gBooks = [
        _createBook('Slaughterhouse-Five', 173, 'book1.jpeg'),
        _createBook('Catch-22', 200, 'book2.jpg'),
        _createBook('The Sirens of Titan', 120, 'book3.jpg'),
    ]
}

function _createBook(title, price, imgUrl) {
    return {
        id: '1234',
        title: title,
        price: price,
        imgUrl: imgUrl
    }
}