'use strict'

var gBooks 

_createBooks()

function getBooks(options = {}) {
    const filterBy = options.filterBy
    const sortBy = options.sortBy
    const page = options.page
    
    var books = gBooks

    books = _filterBooks(filterBy)
    // console.log('books:', books)
    books = _sortBooks(sortBy)

   const startIdx = page.idx * page.size
   const endIdx =  startIdx + page.size
   
   books = books.slice(startIdx, endIdx)

   return books
}



// function setFilterBy(filterBy) {
//     if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
// }

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
    
}

function getStats() {
    return gBooks.reduce((acc, book) => {
        if (book.price > 200) acc.expensive++
        else if (book.price > 80) acc.average++
        else acc.cheap++

        return acc
    }, { expensive: 0, average: 0, cheap: 0 })
}

function removeBook(bookId) {
    const idx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
    
    _saveBooksToStorage()
}

function addBook(title, price, rating) {
    const book = _createBook(title, price, rating)
    gBooks.unshift(book)
    
    _saveBooksToStorage()
    return book
}

// function updateBook(bookId, key, value) {
//     const bookIdx = gBooks.findIndex(book => book.id == bookId)
//     gBooks[bookIdx][key] = value
    
//     _saveBooksToStorage()
//     return book
// }

function updateBook(bookId, newTitle, newPrice) {
    const book = getBookById(bookId)
    book.title = newTitle
    book.price = newPrice

    _saveBooksToStorage()
    return book
}

function updateRating(bookId, diff) {
    const book = getBookById(bookId)
    const newRating = book.rating + diff
    if (newRating >= 0 && newRating <= 5) {
        book.rating = newRating
        _saveBooksToStorage()
    }
    return book
}

function getPageCount(options) {
    const filterBy = options.filterBy
    const page = options.page

    var booksLength = _filterBooks(filterBy).length
    var pageCount = Math.ceil(booksLength / page.size)
    return pageCount
}

function _filterBooks(filterBy) {
    var books = gBooks
    if (filterBy.title) books = books.filter(book => book.title.toLowerCase().includes(filterBy.title.toLowerCase()))
    if (filterBy.rating) books = books.filter(book => book.rating >= filterBy.rating)
    return books
}

function _createBooks() {
    gBooks = loadFromStorage('books') || []
    if (gBooks && gBooks.length) return

    gBooks = [
        _createBook('Slaughterhouse-Five', 70, 'book1.jpeg'),
        _createBook('Catch-22', 50, 'book2.jpg'),
        _createBook('The Sirens of Titan', 120, 'book3.jpg'),
        _createBook('If We Were Villains', 230),
        _createBook('The Likeness', 250),
        _createBook('Black Chalk', 20),
    ]
    
    _saveBooksToStorage()
}

function _sortBooks(sortBy) {
    var books = gBooks

    if (sortBy.title) {
        books = books.toSorted((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.title)
    }
    if (sortBy.price) {
        books = books.toSorted((b1, b2) => (b1.price - b2.price) * sortBy.price)
    }
    if (sortBy.rating) {
        books = books.toSorted((b1, b2) => (b1.rating - b2.rating) * sortBy.rating)
    }
    return books
}

function _createBook(title, price, imgUrl) {
    const id = makeId()
    return {
        id: `b${id}`,
        title: title,
        price: price,
        imgUrl: imgUrl || 'book-cover-placeholder.png',
        desc: makeLorem(100),
        rating: getRandomIntInclusive(1, 5)
    }
}

function _saveBooksToStorage() {
    saveToStorage('books', gBooks)
}