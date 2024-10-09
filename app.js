// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title.trim();
        this.author = author.trim();
        this.isbn = isbn.trim();
    }
}

// UI Class: Handle UI Tasks
class UI {
    // Display Books from LocalStorage
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    // Add a Book to the List in UI
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    // Delete a Book from the List in UI
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Show Alert Messages
    static showAlert(message, className) {
        // Check if an alert already exists to prevent duplicates
        if (document.querySelector('.alert')) return;

        const div = document.createElement('div');
        div.className = `alert alert-${className} alert-dismissible fade show`;
        div.appendChild(document.createTextNode(message));

        // Create a button for dismissing the alert
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-close';
        button.setAttribute('data-bs-dismiss', 'alert');
        button.setAttribute('aria-label', 'Close');
        div.appendChild(button);

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => {
            if (div) div.remove();
        }, 3000);
    }

    // Clear Input Fields
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    // Retrieve Books from LocalStorage
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            try {
                books = JSON.parse(localStorage.getItem('books'));
                // Validate that books is an array
                if (!Array.isArray(books)) throw new Error('Books data is not an array');
            } catch (e) {
                console.error('Error parsing books from localStorage:', e);
                books = [];
            }
        }
        return books;
    }

    // Add a Book to LocalStorage
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        try {
            localStorage.setItem('books', JSON.stringify(books));
        } catch (e) {
            console.error('Error saving book to localStorage:', e);
        }
    }

    // Remove a Book from LocalStorage by ISBN
    static removeBook(isbn) {
        let books = Store.getBooks();
        // Filter out the book with the matching ISBN
        books = books.filter((book) => book.isbn !== isbn);
        try {
            localStorage.setItem('books', JSON.stringify(books));
        } catch (e) {
            console.error('Error removing book from localStorage:', e);
        }
    }
}

// Event: Display Books on DOM Load
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate a new Book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to Store
        Store.addBook(book);

        // Show Success Message
        UI.showAlert('Book Added', 'success');

        // Clear Fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior

    if (e.target.classList.contains('delete')) {
        // Get the ISBN of the book to remove
        const isbn = e.target.parentElement.previousElementSibling.textContent;

        // Remove Book from UI
        UI.deleteBook(e.target);

        // Remove Book from Store
        Store.removeBook(isbn);

        // Show Success Message
        UI.showAlert('Book Removed', 'success');
    }
});
