'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elTableBody = document.querySelector('.book-list')

    if (!getBooks().length) {
        elTableBody.innerHTML = `<tr>
        <td colspan="4">No matching books were found...</td>
        </tr>`
        return
    }
    const strHTMLs = getBooks().map(book => `
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
    elTableBody.innerHTML = strHTMLs.join('')
    renderStats()
}
renderBooksCards()
function renderBooksCards() {
    const elCardsContainer = document.querySelector('.cards-container')
    const strHTMLs = getBooks().map(book => `<article class="card-preview">
                <img src="img/book2.jpg" />
                <h5>${book.title}</h5>
                <p>${makeLorem(6)}</p>
                <h6>${formatPrice(book.price)}<h6>
                <button onclick="onReadBook('${book.id}')" class="read">Read</button>
                    <button onclick="onUpdateBook('${book.id}', 'title')" class="update-title">Update Title</button>
                    <button onclick="onUpdateBook('${book.id}', 'price')" class="update-price">Update Price</button>
                    <button onclick="onRemoveBook('${book.id}')" class="delete">Delete</button>
            </article>          
            `)

    elCardsContainer.innerHTML = strHTMLs.join('')
}

function onReadBook(bookId) { 
    const elDetails = document.querySelector('.book-details')
    const book = getBookById(bookId)

    elDetails.querySelector(".book-cover-img img").src = `img/${book.imgUrl}`
    elDetails.querySelector(".book-desc h3").innerText = book.title
    elDetails.querySelector(".book-desc p").innerText = book.desc


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
    flashMsg('Updated')
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    flashMsg('Book Deleted')
    renderBooks()
}

function onAddBook() {
    const title = prompt('Book title?')
    const price = +prompt('Book Price?')
    if (!title || !price || price <= 0 || isNaN(price) ) {
        return alert('Book title cannot be blank and book price must be a positive number. Please enter valid values.')
    }
    
    addBook(capitalizeFirstLetterOfEachWord(title), price)
    flashMsg('Book Added')
    renderBooks()
}

function onSetFilterBy(filterBy) {
    setFilterBy(filterBy)
    renderBooks()
}

function onResetFilter() {
    setFilterBy({ title: '' })
    renderBooks()

    const elTitle = document.querySelector(".book-title");
    elTitle.value = ""
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() =>{
        el.classList.remove('open')
    }, 2000)
}

function renderStats() {
    const elStats = document.querySelector('footer .stats')

    const elExpensive = elStats.querySelector('.expensive')
    const elAverage = elStats.querySelector('.average')
    const elCheap = elStats.querySelector('.cheap')
    
    const expensive =getExpensiveBooksCount()
    const average = getAverageBooksCount()
    const cheap = getCheapBooksCount()

    elExpensive.innerText = expensive
    elAverage.innerText = average
    elCheap.innerText = cheap
}