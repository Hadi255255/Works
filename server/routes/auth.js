const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Notes')
const passport = require('passport');
const { isNotLoggedIn } = require('../middleware/checkAuth');

const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { profile } = require('../controllers/mainController');
const { param } = require('express-validator');
const Events = require('../models/Events');
const JWT_SECRET = 'Some super secret .....'


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, done) {
        var paramsName = profile.name.givenName + profile.name.familyName;
        User.find({ fullName: profile.name.givenName + ' ' + profile.name.familyName })
            .then((users) => {
                if (users.length > 0) {
                    var nameLength = (profile.name.givenName + profile.name.familyName).length;
                    var usersLength = users.length;
                    var maxNumber = 1;
                    users.forEach(element => {
                        var elementNumber = Number(element.paramsName.slice(nameLength));
                        if (elementNumber > maxNumber) { maxNumber = elementNumber }
                    });
                    paramsName += String(maxNumber + 1)
                }
            })
        if (paramsName.includes(' ')) { paramsName = paramsName.replace(/ /g, '-') };
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
            paramsName: paramsName,
            fullName: profile.name.givenName + ' ' + profile.name.familyName,
            confirmed: 'true',
        }
        try {
            let user = await User.findOne({ googleId: profile.id })
            if (user) {
                const eventUpdate = {
                    signinDate: new Date(),
                };
                Events.findOneAndUpdate({ email: user.email }, { $set: eventUpdate }, { $upset: true })
                    .then((event) => {
                        if (!event) {
                            const newEvents = new Events({
                                email: user.email,
                                signupDate: new Date(),
                                signinDate: new Date(),
                            });
                            newEvents.save();
                        }
                    })
                done(null, user)
            } else {
                User.findOne({ email: profile.emails[0].value })
                    .then((userEmail) => {
                        if (userEmail) {     // Already signed up by email
                            const eventUpdate = {
                                signinDate: new Date(),
                            };
                            Events.findOneAndUpdate({ email: userEmail.email }, { $set: eventUpdate }, { $upset: true })
                                .then((event) => {
                                    if (!event) {
                                        const newEvents = new Events({
                                            email: user.email,
                                            signupDate: new Date(),
                                            signinDate: new Date(),
                                        });
                                        newEvents.save();
                                    }
                                })
                            //________ Auto sign in_______________
                            done(null, userEmail)
                        } else { // Never signed up before.
                            user = User.create(newUser)
                                .then((user) => {
                                    const newEvents = new Events({
                                        email: user.email,
                                        signupDate: new Date(),
                                        signinDate: new Date(),
                                    });
                                    newEvents.save();
                                    done(null, user)
                                })
                        }
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }
));

router.get('/auth/google', isNotLoggedIn,
    passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', isNotLoggedIn,
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/'
    }),
);
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...')
})
// Presist user dat after successful authentication
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

// Retrieve user data from session
passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then((user) => {
            // var profile1 = profile;
            // console.log('profile1: ', profile1)
            var director;
            if (user) {
                var userID = user._id;
                thisUser = user;
                userNote = '';
                Note.find({ user: id })
                    .then((note) => {
                        if (note) {
                            userNote = note
                        }
                        else {
                            userNote = 'No note'
                        }
                        done(null, user)
                    })
            }

        })
        .catch((err) => {
            return done('Sign Error :', err)
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) { console.log(error); res.send('Error logging out') }
        else { res.redirect('/') }
    })
})
//____________________________   Sign up _________________________________
passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var paramsName;
    User.findOne({ email: email })
        .then((user) => {
            if (user && user.password) {
                return done(null, false, req.flash('signinError', "This user already exists."))
            }
            var paramsName = req.body.firstName.trim() + req.body.lastName.trim();
            User.find({ fullName: req.body.firstName + ' ' + req.body.lastName })
                .then((users) => {
                    if (users.length > 0 || (req.body.firstName + req.body.lastName == '')) {
                        var nameLength = (req.body.firstName.trim() + req.body.lastName.trim()).length;
                        var usersLength = users.length;
                        var maxNumber = 1;
                        if (req.body.firstName + req.body.lastName == '') { maxNumber = 0 }
                        users.forEach(element => {
                            var elementNumber = Number(element.paramsName.slice(nameLength));
                            if (elementNumber > maxNumber) { maxNumber = elementNumber }
                        });
                        paramsName = req.body.firstName.trim() + req.body.lastName.trim() + String(maxNumber + 1)
                    }
                    if (paramsName.includes(' ')) { paramsName = paramsName.replace(/ /g, '-') };
                    const newUser = new User({
                        email: req.body.email.trim(),
                        password: new User().hashPassword(password),
                        firstName: req.body.firstName.trim(),
                        lastName: req.body.lastName.trim(),
                        fullName: req.body.firstName.trim() + ' ' + req.body.lastName.trim(),
                        paramsName: paramsName,
                    });
                    newUser.save()
                        .then((user) => {
                            const secret = JWT_SECRET + user.password
                            const payload = {
                                email: user.email,
                                id: user._id
                            }
                            const token = jwt.sign(payload, secret, { expiresIn: '1500m' });
                            const link = `https://works-iikg.onrender.com/confirmEmail/${user._id}/${token}`;
                            // const link = `http://localhost:5000/confirmEmail/${user._id}/${token}`;
                            // console.log(link);
                            // console.log('user.email 1:', user.email);
                            // ************* Send email **********************************
                            var transporter = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                    user: 'engineer.shadirahhal@gmail.com',
                                    pass: 'xeod hhnl ygek beeh'
                                }
                            });
                            var mailOptions = {
                                from: 'engineer.shadirahhal@gmail.com',
                                to: user.email,
                                subject: "Confirm Email",
                                text: `Click this link to confirm your email 
                                 ` + link

                            }
                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log("Error , You are not connected: ", err)
                                    // res.render("signup", { messages: 'You are not connected ' });
                                } else {
                                    // console.log("Confirmation link has been sent to your email");

                                }
                            });
                            // *************** End Sending email ***************************
                            // console.log('newUser: ', user)
                            const newEvents = new Events({
                                email: user.email,
                                signupDate: new Date().toLocaleString(),
                            });
                            newEvents.save();
                            return done(null, user, req.flash('signSuccess', 'Successfully created a new user.'), req.flash('inform', 'A confirmation link has been sent to your email.'))
                        })
                        .catch((err) => console.log(err))
                })
        })
        .catch((err) => {
            return done(err)
        })
}))
//__________________________  Sign in __________________________________
passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    // User.find({}).then((users) => { console.log('users:!:', users) });
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return done(null, false, req.flash('signinError', "No user with this email"))
            }
            if (user && !user.password) {
                return done(null, false, req.flash('signinError', "You can sign up, and confirm your email by clicking the link."));
            }
            if (!user.comparePassword(password)) {
                return done(null, false, req.flash('signinError', "Wrong password"));
            }
            if (req.body.email == '') {
                return done(null, false, req.flash('signinError', "Insert your email"))
            };
            const eventUpdate = {
                signinDate: new Date()
            };
            Events.findOneAndUpdate({ email: user.email }, { $set: eventUpdate }, { $upset: true })
                .then((event) => {
                    if (!event) {
                        const newEvents = new Events({
                            email: user.email,
                            signinDate: new Date(),
                        });
                        newEvents.save();
                    }
                })
            return done(null, user);
        })
        .catch((err) => {
            return done('Sign Error :', err)
        })
}))


module.exports = router;
