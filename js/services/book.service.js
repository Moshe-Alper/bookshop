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

function updateBook(bookId, key, value) {
    const bookIdx = gBooks.findIndex(book => book.id == bookId)
    gBooks[bookIdx][key] = value
//
    _saveBooks()
}

function removeBook(bookId) {
    const idx = getBooks().findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)

    _saveBooks()
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)

    _saveBooks()
}

function _createBooks() {
    gBooks = loadFromStorage('books')
    if (gBooks && gBooks.length > 0) return

    gBooks = [
        _createBook('Slaughterhouse-Five', 70, 'book1.jpeg'),
        _createBook('Catch-22', 50, 'book2.jpg'),
        _createBook('The Sirens of Titan', 65, 'book3.jpg'),
    ]
    _saveBooks()
}

function _createBook(title, price, imgUrl) {
    const id = makeid()
    return {
        id: `b${id}`,
        title: title,
        price: price,
        imgUrl: imgUrl || 'book-cover-placeholder.png'
    }
}
function _saveBooks() {
    saveToStorage('books', gBooks)
}