const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    // users is array or object? handle safely
    if (Array.isArray(users)) {
        if (users.some(u => u.username === username)) {
            return res.status(409).json({ message: "User already exists" });
        }
        users.push({ username, password });
    } else {
        users[username] = { password };
    }

    return res.status(200).json({ message: "User registered successfully" });
});



// TASK 10 - Get all books (FIXED - no axios loop)
public_users.get('/', async function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});



// TASK 12 - Author (FIXED case-insensitive)
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();

        let filteredBooks = {};

        Object.keys(books).forEach((key) => {
            if (books[key].author.toLowerCase() === author) {
                filteredBooks[key] = books[key];
            }
        });

        return res.status(200).json(filteredBooks);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});



// TASK 13 - Title (FIXED case-insensitive)
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();

        let result = {};

        Object.keys(books).forEach((key) => {
            if (books[key].title.toLowerCase() === title) {
                result[key] = books[key];
            }
        });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});



// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 2));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;