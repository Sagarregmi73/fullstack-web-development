require('dotenv').config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb+srv://admin-sagar:test123@cluster0.qbzg5.mongodb.net/mongoDB', { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model('User', userSchema);
//TODO

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/login.html");
});
app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html");
});
app.get("/logout", function(req, res) {
    res.redirect("/");
});

app.post("/register", function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.sendFile(__dirname + "/authorize.html");
            }
        });
    });


});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if (result === true) {
                        res.sendFile(__dirname + "/authorize.html");
                    }

                });


            }
        }
    })
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server started succesfully");
});