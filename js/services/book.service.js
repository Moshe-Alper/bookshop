'use strict'

var gBooks = [
    {
        id: 'bg4J48',
        title: 'Slaughterhouse-Five',
        price: 173,
        imgUrl: 'lori-ipsi.jpg'
    },

    {
        id: 'cd4J38',
        title: 'Catch-22',
        price: 120,
        imgUrl: 'lori-ipsi.jpg'
    },

    {
        id: 'fr4228',
        title: 'The Sirens of Titan',
        price: 200,
        imgUrl: 'lori-ipsi.jpg'
    }
]

function getBooks() {
    return gBooks
}

function removeBook(bookId) {
    const idx = getBooks().findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
}

function updatePrice(bookId, newPrice) {
    const bookIdx = gBooks.findIndex(book => book.id == bookId)
    gBooks[bookIdx].price = newPrice
}

