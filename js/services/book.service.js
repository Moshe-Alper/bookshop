'use strict'

var gBooks = []
var gFilterBy = ''

_createBooks()

var gFilterBy = {
    title: ''
}

function setFilterBy(filterBy) {
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
}

function getBooks() {
    const books = gBooks.filter(book => book.title.includes(gFilterBy.title))
    return books
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
        _createBook('The Sirens of Titan', 120, 'book3.jpg'),
        _createBook('If We Were Villains', 230),
        _createBook('The Likeness', 250),
        _createBook('Black Chalk', 20),
    ]
    _saveBooks()
}

function _createBook(title, price, imgUrl) {
    const id = makeid()
    return {
        id: `b${id}`,
        title: title,
        price: price,
        imgUrl: imgUrl || 'book-cover-placeholder.png',
        desc: makeLorem(100),
        rating: 0
    }
}
function _saveBooks() {
    saveToStorage('books', gBooks)
}

function getExpensiveBooksCount() {
    return gBooks.filter(book => book.price > 200).length
}

function getAverageBooksCount() {
    return gBooks.filter(book => book.price > 80 && book.price < 200).length
}

function getCheapBooksCount() {
    return gBooks.filter(book => book.price < 80).length
}

function updateRating(bookId, diff) {
    const book = getBookById(bookId)
    const newRating = book.rating + diff
    if (newRating >= 0 && newRating <= 5) {
        book.rating = newRating
        _saveBooks()
    }
    return book
}