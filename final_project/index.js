const express = require('express');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());


app.use(session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: false
}));


app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "User not logged in" });
    }
    next();
});

// routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;

app.listen(PORT, () => console.log("Server is running on port 5000"));