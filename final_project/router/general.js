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

// Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get books based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    let filteredBooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author) {
            filteredBooks[key] = books[key];
        }
    });

    return res.status(200).json(filteredBooks);
});

// Get books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    let filteredBooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title) {
            filteredBooks[key] = books[key];
        }
    });

    return res.status(200).json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Axios + async/await task
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

module.exports.general = public_users;
