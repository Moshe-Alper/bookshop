'use strict'

var gBooks = [
    {
        id: 'bg4J48',
        title: 'Slaughterhouse-Five',
        price: 173,
        imgUrl: 'book1.jpeg'
    },

    {
        id: 'cd4J38',
        title: 'Catch-22',
        price: 120,
        imgUrl: 'book2.jpg'
    },

    {
        id: 'fr4228',
        title: 'The Sirens of Titan',
        price: 200,
        imgUrl: 'book3.jpg'
    }
]

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