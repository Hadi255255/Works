const User = require('../models/User');
const passport = require('passport');

exports.isLoggedIn = function (req, res, next) {
    // console.log('req.user ', req.user);
    if (req.user) {
        next();
    } else {
        return res.redirect('/signin');
    }
}
exports.isNotLoggedIn = function (req, res, next) {
    // console.log('req.user ', req.user);
    if (!req.user) {
        next();
    } else {
        return res.send('<h1 style="text-align:center">Access Denied</h1>')
    }
}