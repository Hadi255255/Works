require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const app = express();
const port = 5000 || process.env.PORT;

const ejs = require('ejs');
const cors = require('cors');
const compression = require('compression');
const fs = require('fs');
const csrf = require('csurf');
const multer = require('multer');
const { param } = require('express-validator');


mongoose.connect('mongodb://127.0.0.1/notes_local')
    .then(() => {
        console.log(`Connected successfully to DataBase notes_local on port ${port}................. `);
    })
    .catch((err) => console.log('error: ', err));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({              //1
    //     mongoUrl: process.env.MONGODB_URI
    // }),
    // cookie: { maxAge: new Date(Date.now() + 3600000) } // 1 hour

}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Deployment access & compression data(response)
app.use(cors());
app.use(compression());


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// Connect to Database          //2
// connectDB();

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    var login, director;
    if (req.user) {
        paramsName = req.user.paramsName;
        login = true;
        if (req.user.email == "engineer.shadirahhal@gmail.com") {
            director = 'yes';
        } else { director = '' }
    } else { login = false; paramsName = 'signin' }

    const locals = {
        paramsNameAdmin: paramsName,
        director: director,
        login: login,
        title: "Works",
        description: "Free platform of works, portfolio, and resume."
    }
    res.render('index', locals)
});

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

app.get('*', (req, res) => {
    // res.status(404).send("Page not found...");
    res.status(404).render('404')
})

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})



