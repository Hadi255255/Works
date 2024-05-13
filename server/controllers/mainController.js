const { isNotLoggedIn } = require('../middleware/checkAuth');
const User = require('../models/User')

exports.homepage = async (req, res) => {
    var messagesError, updateSuccess, messageInform, login;
    messagesError = req.flash('signinError');
    messageSuccess = req.flash('updateSuccess');
    messageInform = req.flash('inform');
    if (req.use) { login = true } else { login = false }
    const locals = {
        title: "Works",
        description: "Free NodeJs Notes App",
        messageSuccess: messageSuccess,
        messagesError: messagesError,
        messageInform: messageInform,
    }
    res.render('index', {
        login: login,
        locals,
        layout: '../views/layouts/front-page',
    }
    )
}

exports.profile = async (req, res) => {
    var login, firstName, lastName, password, email, messagesError, messageSuccess, confirmed, messageInform, image, speciality, education, skills, paramsName, gender, location, birthday, paramsNameAdmin;
    if (req.user) { paramsNameAdmin = req.user.paramsName }
    else {
        paramsNameAdmin = "signin"
    }
    if (req.user) {
        if (req.user.email == "engineer.shadirahhal@gmail.com") {
            director = 'yes';
        } else { director = '' }
        messagesError = req.flash('signinError');
        messageSuccess = req.flash('updateSuccess');
        messageInform = req.flash('inform');
        login = true;
        firstName = req.user.firstName
        lastName = req.user.lastName;
        paramsName = req.user.paramsName;
        userName = req.user.firstName + ' ' + req.user.lastName;
        email = req.user.email
        password = req.user.password
        confirmed = req.user.confirmed;
        image = req.user.image;
        speciality = req.user.speciality;
        education = req.user.education;
        skills = req.user.skills;
        gender = req.user.gender;
        location = req.user.location;
        birthday = req.user.birthday;
    } else { login = false; messagesError = ''; messageSuccess = '' }
    const locals = {
        userName: userName,
        admin: true,
        confirmed: confirmed,
        messageSuccess: messageSuccess,
        messagesError: messagesError,
        messageInform: messageInform,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
        paramsName: paramsName,
        paramsNameAdmin: paramsNameAdmin,
        login: login,
        title: "Profile",
        description: "Free NodeJs Notes App ",
        image: image,
        director: director,
        speciality: speciality,
        education: education,
        skills: skills,
        gender: gender,
        location: location,
        birthday: birthday,
        googleId: req.user.googleId,
    }
    res.render('profile', {
        locals,
        layout: '../views/layouts/front-page',
    })
}