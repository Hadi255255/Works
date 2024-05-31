const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const passport = require('passport');
const { isLoggedIn } = require('../middleware/checkAuth');
const { isNotLoggedIn } = require('../middleware/checkAuth');
const { isDirector } = require('../middleware/checkAuth');
const User = require('../models/User');
const Note = require('../models/Notes');
const Events = require('../models/Events');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const JWT_SECRET = 'Some super secret .....';
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const csrf = require('csurf');
const multer = require('multer');
require('../routes/auth');
const cloudinary = require('../cloudinary');

// App routes
router.get('/', mainController.homepage);
router.get('/profile', isLoggedIn, mainController.profile);
router.get('/signup', isNotLoggedIn, (req, res) => {
  // User.deleteMany({}).then((u) => { })
  // Note.deleteMany({}).then((n) => {
  //   Note.find({}).then((n) => { console.log(n) });
  //   User.find({}).then((u) => { console.log(u) });
  // })
  var paramsNameAdmin;
  if (req.user) { paramsNameAdmin = req.user.paramsName }
  else { paramsNameAdmin = "signin" }
  const locals = {
    paramsNameAdmin: paramsNameAdmin,
  }
  var messagesError = req.flash('signinError');
  if (req.isAuthenticated()) { return res.redirect("/") }
  res.render('signup', { messagesError: messagesError, locals })
});

router.post('/signup', isNotLoggedIn, (req, res, next) => {
  next();
}, passport.authenticate('local-signup', {
  session: false,
  successRedirect: 'signin',
  failureRedirect: 'signup',
  failureMessage: true,
}
));
router.get('/signin', isNotLoggedIn, (req, res, next) => {
  // User.find({}).then((users) => {
  // console.log('users:   :', users)
  // })
  var paramsNameAdmin;
  if (req.user) { paramsNameAdmin = req.user.paramsName }
  else {
    paramsNameAdmin = "signin";
  }
  const locals = {
    paramsNameAdmin: paramsNameAdmin,
  }
  var messagesError = req.flash('signinError');
  var messageSuccess = req.flash('signSuccess');
  var messageInform = req.flash('inform');
  if (req.isAuthenticated()) { res.redirect("/") }
  res.render('signin', {
    locals,
    messagesError: messagesError,
    messageSuccess: messageSuccess,
    messageInform: messageInform,
  });
});
router.post('/signin', isNotLoggedIn, (req, res, next) => {
  next();
}, passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: 'signin',
  failureFlash: true,
}));

router.post('/updateUser', (req, res, next) => {
  var updateUser, newPassword, birthday;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var education = req.body.education;
  var speciality = req.body.speciality;
  var skills = req.body.skills;
  var location = req.body.location;
  var gender = req.body.gender;
  var confirmed = req.user.confirmed;
  var messageSuccess = req.flash('updateSuccess');
  var messageInform = req.flash('inform');
  if (req.body.birthday) {
    birthday = String(req.body.birthday);
  } else { birthday = req.user.birthday }
  if (1 == 1) {
    while (education[education.length - 1] == ' ' ||
      education[education.length - 1] == ',' ||
      education[education.length - 1] == '.' ||
      education[education.length - 1] == '-') {
      education = education.slice(0, -1)
    }
    while (speciality[speciality.length - 1] == ' ' ||
      speciality[speciality.length - 1] == ',' ||
      speciality[speciality.length - 1] == '.' ||
      speciality[speciality.length - 1] == '-') {
      speciality = speciality.slice(0, -1)
    }
    while (skills[skills.length - 1] == ' ' ||
      skills[skills.length - 1] == ',' ||
      skills[skills.length - 1] == '.' ||
      skills[skills.length - 1] == '-') {
      skills = skills.slice(0, -1)
    }
    while (location[location.length - 1] == ' ' ||
      location[location.length - 1] == ',' ||
      location[location.length - 1] == '.' ||
      location[location.length - 1] == '-') {
      location = location.slice(0, -1)
    }
    while (speciality.includes('  ') || speciality.includes(',,') || speciality.includes('..')) {
      speciality = speciality.replace('  ', ' ');
      speciality = speciality.replace(',,', ',');
      speciality = speciality.replace('..', '.');
    }
    while (education.includes('  ') || education.includes(',,') || education.includes('..')) {
      education = education.replace('  ', ' ');
      education = education.replace(',,', ',');
      education = education.replace('..', '.');
    }
    while (skills.includes('  ') || skills.includes(',,') || skills.includes('..')) {
      skills = skills.replace('  ', ' ');
      skills = skills.replace(',,', ',');
      skills = skills.replace('..', '.');
    }
    while (location.includes('  ') || location.includes(',,') || location.includes('..')) {
      location = location.replace('  ', ' ');
      location = location.replace(',,', ',');
      location = location.replace('..', '.');
    }
    for (let i = 0; i < skills.length; i++) {
      if (skills[i] == ',' && skills[i + 1] != ` `) {
        skills = skills.replace(skills[i + 1], ' ' + skills[i + 1]);
        i++
      }
    }
    for (let i = 0; i < speciality.length; i++) {
      if (speciality[i] == ',' && speciality[i + 1] != ` `) {
        speciality = speciality.replace(speciality[i + 1], ' ' + speciality[i + 1]);
        i++
      }
    }
    for (let i = 0; i < education.length; i++) {
      if (education[i] == ',' && education[i + 1] != ` `) {
        education = education.replace(education[i + 1], ' ' + education[i + 1]);
        i++
      }
    }
    for (let i = 0; i < location.length; i++) {
      if (location[i] == ',' && location[i + 1] != ` `) {
        location = location.replace(location[i + 1], ' ' + location[i + 1]);
        i++
      }
    }
  }
  if (req.body.email.trim() != req.user.email) {
    confirmed = 'false';
  }
  console.log('req.body.password: ', req.body.password)
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(204).send()
    } else {
      newPassword = new User().hashPassword(req.body.password);
    }
  }
  else if (req.body.password == "") { return res.status(204).send() }

  if (firstName == req.user.firstName && lastName == req.user.lastName) {
    var paramsName = req.user.paramsName;
    if (req.body.password != undefined) {
      updateUser = {
        "email": req.body.email.trim(),
        "password": newPassword,
        "confirmed": confirmed,
        "speciality": speciality,
        "education": education,
        "skills": skills,
        "gender": gender,
        "location": location,
        "birthday": birthday,
      }
    } else {
      updateUser = {
        "email": req.body.email.trim(),
        "confirmed": confirmed,
        "speciality": speciality,
        "education": education,
        "skills": skills,
        "gender": gender,
        "location": location,
        "birthday": birthday,
      }
    }
    User.findOne({ email: req.body.email.trim() })
      .then((user) => {
        if (user && user.email != thisUser.email) {
          req.flash('signinError', "This user already exists.");
          return res.redirect('back')
        }
        const doc = User.findOneAndUpdate({ _id: req.user._id }, { $set: updateUser }, { $upset: true })
          .then((Successful) => {
            if (req.isAuthenticated()) {
              if (confirmed == 'false' && req.user.email != req.body.email.trim()) {
                req.flash('inform', "A confirmation link has been sent to your email.")
                const secret = JWT_SECRET + newPassword;
                const payload = {
                  email: req.body.email.trim(),
                  id: req.user._id
                }
                const token = jwt.sign(payload, secret, { expiresIn: '1500m' });
                const link = `https://works-iikg.onrender.com/confirmEmail/${req.user._id}/${token}`;
                // const link = `http://localhost:5000/confirmEmail/${req.user._id}/${token}`;
                // console.log(link);
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
                  to: req.body.email.trim(),
                  subject: "Confirm Email",
                  text: `Click this link to confirm your email 
                   ` + link

                }
                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    console.log("Error , You are not connected: ", err)
                    // res.render("signup", { messages: 'You are not connected ' });
                  }
                });
              }
              // *************** End Sending email *********************** 
              req.flash('updateSuccess', "Successfully updated !");
              return res.redirect('/' + paramsName)
            }
          });
        if (!doc) { console.log('Not Successful: no doc') }
      })
  } else {
    var paramsName = firstName.trim() + lastName.trim();
    var fullName = firstName.trim() + ' ' + lastName.trim();
    User.find({ fullName: fullName })
      .then((users) => {
        if (users.length > 0 || (firstName + lastName == '')) {
          var nameLength = (firstName.trim() + lastName.trim()).length;
          var usersLength = users.length;
          var maxNumber = 1;
          if (firstName + lastName == '') { maxNumber = 0 }
          users.forEach(element => {
            var elementNumber = Number(element.paramsName.slice(nameLength));
            if (elementNumber > maxNumber) { maxNumber = elementNumber }
          });
          paramsName = firstName.trim() + lastName.trim() + String(maxNumber + 1)
        }
        if (paramsName.includes(' ')) { paramsName = paramsName.replace(/ /g, '-') };
        if (req.body.password != undefined) {
          updateUser = {
            "firstName": firstName.trim(),
            "lastName": lastName.trim(),
            "fullName": fullName,
            "email": req.body.email.trim(),
            "password": newPassword,
            "confirmed": confirmed,
            "speciality": speciality,
            "education": education,
            "skills": skills,
            'paramsName': paramsName,
            "gender": gender,
            "location": location,
            "birthday": birthday,
          };
          if (req.body.password.length < 6) {
            req.flash('signinError', "Minimum password's length is 6. ");
            return res.redirect(req.get('referer'));
            // return res.redirect('back')
          }
        } else {
          updateUser = {
            "firstName": firstName.trim(),
            "lastName": lastName.trim(),
            "fullName": fullName,
            "email": req.body.email.trim(),
            "confirmed": confirmed,
            "speciality": speciality,
            "education": education,
            "skills": skills,
            'paramsName': paramsName,
            "gender": gender,
            "location": location,
            "birthday": birthday,
          };
        }
        User.findOne({ email: req.body.email.trim() })
          .then((user) => {
            if (user && user.email != thisUser.email) {
              req.flash('signinError', "This user already exists.");
              return res.redirect('back')
            }
            const doc = User.findOneAndUpdate({ _id: req.user._id }, { $set: updateUser }, { $upset: true })
              .then((Successful) => {
                if (req.isAuthenticated()) {
                  req.flash('updateSuccess', "Successfully updated !");
                  console.log(req.user.email);
                  console.log(req.body.email.trim());
                  // *************** Sending email ***********************
                  if (confirmed == 'false' && req.user.email != req.body.email.trim()) {
                    req.flash('inform', "A confirmation link has been sent to your email.")
                    const secret = JWT_SECRET + newPassword;
                    const payload = {
                      email: req.body.email.trim(),
                      id: req.user._id
                    }
                    const token = jwt.sign(payload, secret, { expiresIn: '1500m' });
                    const link = `https://works-iikg.onrender.com/confirmEmail/${req.user._id}/${token}`;
                    // const link = `http://localhost:5000/confirmEmail/${req.user._id}/${token}`;
                    // console.log(link);
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
                      to: req.body.email.trim(),
                      subject: "Confirm Email",
                      text: `Click this link to confirm your email 
                           ` + link

                    }
                    transporter.sendMail(mailOptions, function (err, info) {
                      if (err) {
                        console.log("Error , You are not connected: ", err)
                        // res.render("signup", { messages: 'You are not connected ' });
                      }
                    });
                  }
                  // *************** End Sending email ***********************
                  // sendLinkFunction(req, res, next);
                  updateNote =
                  {
                    userEmail: req.body.email.trim(),
                    userFullName: req.body.firstName.trim() + ' ' + req.body.lastName.trim(),
                    userParamsName: paramsName,
                  }
                  Note.updateMany({ user: req.user._id }, { $set: updateNote }, { $upset: true })
                    .then((notes) => { })
                  req.flash('updateSuccess', "Successfully updated !");
                  return res.redirect('/' + paramsName)
                }
              });
            if (!doc) { console.log('Not Successful: no doc') }
          })
      })
  }
});
router.get('/forgotPassword', (req, res) => {
  var messageInform = req.flash('inform');
  var paramsNameAdmin;
  if (req.user) { paramsNameAdmin = req.user.paramsName }
  else { paramsNameAdmin = "signin" }
  res.render('forgotPassword', {
    messageInform: messageInform,
    paramsNameAdmin: paramsNameAdmin,
  })
});

router.post('/forgotPassword', (req, res, next) => {
  const email = req.body.email.trim(); // Or: req.body.trim() 
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('inform', 'This email is not found.')
        res.redirect("forgotPassword");
      }
      else {
        const secret = JWT_SECRET + user.password
        const payload = {
          email: user.email,
          id: user._id
        }
        const token = jwt.sign(payload, secret, { expiresIn: '15000m' });
        const link = `https://works-iikg.onrender.com/resetPassword/${user._id}/${token}`;
        // const link = `http://localhost:5000/confirmEmail/${user._id}/${token}`;
        // console.log(link);
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
          to: email,
          subject: "Change password",
          text: `Click this link to change your password 
               ` + link

        }
        transporter.sendMail(mailOptions, function (err, info) {
          console.log('Error', err)
          console.log('info', info)
          if (err) {
            console.log('Error', err)
          } else {
            console.log('info', info)
          }
          req.flash('inform', 'A reset link has been sent to your email')
          res.redirect("forgotPassword");
        })
        // ************* end sending email *****************************
      }
    })
});
router.get('/resetPassword/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  User.findOne({ _id: id })
    .then((user) => {
      if (!user) { res.send("Not found user") }
      else {
        const secret = JWT_SECRET + user.password
        try {
          const payload = jwt.verify(token, secret);
          var messagesError = req.flash('signinError');
          res.render('resetPassword', { email: user.email })
        }
        catch (err) {
          res.send('ERROR:: ' + err.message)
        }
      }
    })
});
router.post('/resetPassword/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  const errors = validationResult(req);
  const errorsMessages = errors.errors;
  var errorsArray = [];
  if (password != password2) {
    req.flash('signinError', "Error: Password and confirm-password aren't matched.");
    return res.redirect('/signin');
  } else if (password.length < 6) {
    req.flash('signinError', "Error: Minimum password'length is 6.");
    return res.redirect('/signin');
  }
  var updateUser = { password: new User().hashPassword(req.body.password) }
  User.findOneAndUpdate({ _id: id }, { $set: updateUser }, { $upset: true })
    .then((user) => {
      if (!user) { res.send("Not found user") }
      else {
        const secret = JWT_SECRET + user.password
        try {
          req.flash = req.flash('signSuccess', "Successfully updated the password");
          res.redirect('/signin')
        }
        catch (err) {
          res.send('ERROR:: ' + err.message)
        }
      }
    })
});
router.get('/confirmEmail/:id/:token', (req, res, next) => {
  var paramsNameAdmin;
  if (req.user) { paramsNameAdmin = req.user.paramsName; login = true }
  else { paramsNameAdmin = "signin"; login = false }
  const locals = {
    paramsNameAdmin: paramsNameAdmin,
    login: login,
  }
  const { id, token } = req.params;
  User.findOne({ _id: id })
    .then((user) => {
      if (!user) { res.send("Not found user") }
      else {
        const secret = JWT_SECRET + user.password
        try {
          const payload = jwt.verify(token, secret);
          User.updateOne({ _id: user._id }, { $set: { confirmed: 'true' } })
            .catch((err) => { })
            .then((users) => {
              User.findOne({ _id: user._id })
                .then((user) => {
                  const thePassword = user.password;
                  const theEmail = user.email;
                  User.find({ email: user.email })
                    .then((isUsers) => {
                      if (isUsers.length == 1) {
                        res.render('./confirmEmail', {
                          locals,
                          signedIn: true,
                          email: user.email
                        })
                      } else if (isUsers.length > 1) {
                        isUsers.forEach((oneUser, i) => {
                          if (oneUser.googleId) {
                            User.updateOne({ googleId: oneUser.googleId }, { $set: { password: thePassword } })
                              .then(() => { })
                          }
                        })
                        isUsers.forEach((oneUser, i) => {
                          if (!oneUser.googleId) {
                            User.deleteOne({ _id: oneUser._id })
                              .then(() => {

                                res.render('./confirmEmail', {
                                  locals,
                                  signedIn: true,
                                  email: theEmail
                                })
                              })
                          }
                        })
                      }
                    })

                })
            })
        }
        catch (err) {
          res.send('ERROR:: ' + err.message)
        }
      }
    })
});
router.get('/sendLink', (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('inform', "A link was sent successfully to your email.")
    sendLinkFunction(req, res, next);
  }
});

// _____________________________ Upload Image ________________________________
const fileFilter = function (req, file, cb) {
  if (file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/svg+xml' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/png' ||
    file.mimetype == 'video/mp4' ||
    file.mimetype == 'video/mp3' ||
    file.mimetype == 'image/gif') {
    cb(null, true)
  } else {
    cb(new Error('Please upload jpeg or svg image '), false)
  }
};
const pdfFilter = function (req, file, cb) {
  if (file.mimetype == 'image/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Please upload jpeg or svg image '), false)
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/user')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + new Date().getTime() + file.originalname)
  }
});
const storage2 = multer.diskStorage({
  destination: function (req, resume, cb) {
    cb(null, './public/img/user')
  },
  filename: function (req, resume, cb) {
    cb(null, new Date().toDateString() + new Date().getTime() + resume.originalname)
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).single('file');

var uploadResume = multer({
  storage: storage2,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).single('resume');

router.get('/events', isDirector, (req, res) => {
  var login;
  if (req.user) { login = true } else { login = false }
  Events.find({}).then((events) => {
    res.render('events', { events: events, login: login })
  });

});
router.post('/deleteHistory', isDirector, (req, res) => {
  Events.deleteMany({})
    .then(() => {
      res.redirect('back')
    })
})
router.post('/uploadfile', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) { res.send("Somthing Error") }

    const path = './public' + req.user.image;
    if (path == './' + req.file.path) { return res.redirect('profile'); }
    if (path == './public/img/user/image.png') {
      const newUser = {
        image: (req.file.path).slice(6),
      };
      // const uploadResult = cloudinary.uploader.upload(req.file.path, {
      //   public_id: req.file.filename
      // }).catch((error) => { console.log(error) })
      //   .then((result) => { console.log('Successful upload to cloudinary: ', result) })

      // console.log('uploadResult: ', uploadResult);
      User.updateOne({ _id: req.user._id }, { $set: newUser })
        .catch((err) => console.log(err))
        .then((doc) => {
          req.flash('updateSuccess', "Successfully updated !");
          return res.redirect('back')
        })
    } else {
      fs.unlink(path, (err) => {
        if (err) {
          const newUser = {
            image: '/img/user/image.png',
          };
          User.updateOne({ _id: req.user._id }, { $set: newUser })
            .catch((err) => console.log(err))
            .then((doc) => {
              req.flash('imageError', [err.message]);
              return res.redirect('back');
            })

        }
        else {

          // const deletResult = cloudinary.uploader.destroy((req.user.image).slice(10))
          //   .catch((error) => { console.log(error) })
          //   .then((result) => { console.log('Successful deleted from cloudinary: ') })
          // const uploadResult = cloudinary.uploader.upload(req.file.path, {
          //   public_id: req.file.filename
          // }).catch((error) => { console.log(error) })
          //   .then((result) => { console.log('Successful upload to cloudinary: ', result) })
          const newUser = {
            image: (req.file.path).slice(6),
          };
          User.updateOne({ _id: req.user._id }, { $set: newUser })
            .catch((err) => console.log(err))
            .then((doc) => {
              req.flash('updateSuccess', "Successfully updated !");
              return res.redirect('back')
            })

        }
      })
    }
  })
});
router.post('/:user/uploadResumefile', (req, res, next) => {
  uploadResume(req, res, function (err) {
    if (err || req.file == undefined) {
      req.flash('updateError', 'Error in this file.');
      return res.redirect('resume');
    };
    const path = './public' + req.user.resume;
    if (path == './' + req.file.path) { return res.redirect('resume'); }
    if (path == './public/img/user/noresume.pdf') {
      // console.log('_______ 1 _______________')
      const newUser = {
        resume: (req.file.path).slice(6),
      };
      // const uploadResult = cloudinary.uploader.upload(req.file.path, {
      //   public_id: req.file.filename
      // }).catch((error) => { console.log(error) })
      //   .then((result) => { console.log('Successful upload to cloudinary') })
      User.updateOne({ _id: req.user._id }, { $set: newUser })
        .catch((err) => console.log(err))
        .then((doc) => {
          req.flash('updateSuccess', "Successfully updated !");
          return res.redirect('resume');
        })
    } else {
      // console.log('________________ 2 _______________')
      fs.unlink(path, (err) => {
        if (err) {
          req.flash('updateError', 'Error in deleting the last one.')
          const newUser = {
            resume: '/img/user/image.png',
          };
          User.updateOne({ _id: req.user._id }, { $set: newUser })
            .catch((err) => console.log(err))
            .then((doc) => {
              req.flash('imageError', [err.message]);
              res.redirect('resume'); return
            })
        }
        else {
          // console.log('__________________ 4 _______________')
          const newUser = {
            resume: (req.file.path).slice(6),
          };
          console.log('req.user.resume: ', req.user.resume)
          // const deletResult = cloudinary.uploader.destroy((req.user.resume).slice(10))
          //   .catch((error) => { console.log(error) })
          //   .then((result) => { console.log('Successful deleted from cloudinary: ') })
          // const uploadResult = cloudinary.uploader.upload(req.file.path, {
          //   public_id: req.file.filename
          // }).catch((error) => { console.log(error) })
          //   .then((result) => { console.log('Successful upload to cloudinary: ', result) })
          User.updateOne({ _id: req.user._id }, { $set: newUser })
            .catch((err) => console.log(err))
            .then((doc) => {

              req.flash('updateSuccess', "Successfully updated !");
              res.redirect('resume')
            })

        }
      })
    }
  })
});
router.get('/users', (req, res, next) => {
  // Note.deleteMany({}).then(() => { })
  var login, paramsName;
  if (req.user) {
    login = true; paramsName = req.user.paramsName;
    userName = req.user.firstName
    if (req.user.email == "engineer.shadirahhal@gmail.com") {
      director = 'yes';
    } else { director = ''; }
  } else { director = '', login = false; paramsName = 'signin' }
  User.find({}).then((users) => {
    var count = users.length;
    Note.find({})
      .then((notes) => {
        var count2 = notes.length;
        const locals = {
          users: users,
          director: director,
          count: count,
          count2: count2,
          notes: notes,
          login: login,
          space: ' ',
          paramsNameAdmin: paramsName,
          paramsName: paramsName,
        }
        res.render('users', { locals, })
      })
  })
});
router.post('/deleteAccount', (req, res, next) => {
  const path = './public' + req.user.image;
  if (path != './public/img/user/image.png') {
    fs.unlink(path, (err) => { console.log('Error in deleting the image of profile.') });
    // const deletImage = cloudinary.uploader.destroy((req.user.image).slice(10))
    //   .catch((error) => { console.log(error) })
    //   .then((result) => { console.log('Successful deleted image from cloudinary: ') })
  };
  const path2 = './public' + req.user.resume;
  if (path2 != './public/img/user/noresume.pdf') {
    fs.unlink(path2, (err) => {
      console.log('Error in deleting the resume.')
    });
    // const deletResume = cloudinary.uploader.destroy((req.user.resume).slice(10))
    //   .catch((error) => { console.log(error) })
    //   .then((result) => { console.log('Successful deleted resume from cloudinary: ') })
  };
  Note.find({ userEmail: req.user.email })
    .then((notes) => {
      if (notes.length > 0) {
        notes.forEach(note => {
          note.groupImages.forEach(img => {
            fs.unlink('./' + img.path, (err) => { console.log('Error in deleting the images of works.') })
            // const deletResult = cloudinary.uploader.destroy(img.filename)
          })
        });
        Note.deleteMany({ user: req.user._id }).then(() => {
          const userId = req.user._id;
          const doc = User.deleteOne({ _id: userId })
            .then((deleted) => {
              req.logOut(() => {
                req.flash('inform', "Your account has been successfully deleted.")
                return res.redirect('/signin');
              })
            })
            .catch(() => { console.log('Error in deleting the user 1.') })
        })
      } else {
        const userId = req.user._id;
        const signinDate = {
          deleteAccountDate: new Date()
        };
        Events.findOneAndUpdate({ email: req.user.email }, { $set: signinDate }, { $upset: true })
          .then((event) => { console.log(event) })
        const doc = User.deleteOne({ _id: userId })
          .then((deleted) => {
            req.logOut(() => {
              var messageInform = req.flash('inform');
              req.flash('inform', "Your account has been successfully deleted.")
              return res.redirect('/signin');
            })
          })
          .catch(() => {
            console.log('Error in deleting the user 2.')
          })

      }
    })

});

router.post('/deleteUser/:id', (req, res, next) => {
  User.findOne({ _id: req.params.id }).then((user) => {
    if (user.email == 'engineer.shadirahhal@gmail.com') {
      return res.redirect('/ShadiRahhal')
    }
    console.log('user.image: ', user.image)
    console.log('user.resume: ', user.resume)
    const path = './public' + user.image;
    if (path != './public/img/user/image.png') {
      fs.unlink(path, (err) => { });
      // const deletImage = cloudinary.uploader.destroy((user.image).slice(10))
      //   .catch((error) => { console.log(error) })
      //   .then((result) => { console.log('Successful deleted image from cloudinary: ') })
    };
    const path2 = './public' + user.resume;
    if (path2 != './public/img/user/noresume.pdf') {
      fs.unlink(path2, (err) => { console.log('Error in deleting the resume.') });
      // const deletResume = cloudinary.uploader.destroy((user.resume).slice(10))
      //   .catch((error) => { console.log(error) })
      //   .then((result) => { console.log('Successful deleted resume from cloudinary: ') })
    };
    Note.find({ userEmail: user.email })
      .then((notes) => {
        if (notes.length > 0) {
          notes.forEach(note => {
            note.groupImages.forEach(img => {
              if (img) {
                fs.unlink('./' + img.path, (err) => { });
                // const deletResult = cloudinary.uploader.destroy(img.filename)
              }
            })
          })
          Note.deleteMany({ userEmail: user.email }).then(() => {
            User.deleteOne({ _id: user._id })
              .then((deleted) => {
                res.redirect('/users')
              })
          })
        } else {
          User.deleteOne({ _id: user._id })
            .then((deleted) => {
              res.redirect('/users')
            })
        }
      })
  })
})
router.get('/users/works', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/signin')
  }
})
router.get('/signin/works', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/signin')
  }
});

router.get('/:user/works', (req, res, next) => {
  var messageInform = req.flash('inform');
  var admin = false;
  let perPage = 12;
  let page = req.query.page || 1;
  var login, confirmed, userName, director, userID, firstName, lastName, paramsName, works, orderWorks, gender, location, birthday, paramsNameAdmin;
  var messageSuccess;
  messageSuccess = req.flash('updateSuccess');

  if (req.user) { paramsNameAdmin = req.user.paramsName }
  else { paramsNameAdmin = "signin" }
  if (req.params.user == 'dashboard') {
    userName = req.user.firstName + ' ' + req.user.lastName;
    login = true;
    confirmed = req.user.confirmed;
    userID = req.user._id;
    if (req.user.email == "engineer.shadirahhal@gmail.com") {
      director = 'yes';
    } else { director = '' }
    Note.find({ user: req.user.id })
      .then((allnotes) => {
        works = allnotes
      })
  }
  Note.find({ userParamsName: req.params.user })
    .then((allnotes) => {
      works = allnotes
    })
  User.find({})
    .then((users) => {
      users.forEach(user => {
        if (user.paramsName == req.params.user) {
          userID = String(user._id);
          userName = user.firstName + ' ' + user.lastName;
          firstName = user.firstName;
          lastName = user.lastName;
          paramsName = user.paramsName;
          orderWorks = user.orderWorks;
          birthday = user.birthday;
          gender = user.gender;
          location = user.location;
          confirmed = user.confirmed;
          if (req.user) {
            login = true;
            if (user.email == req.user.email) {
              admin = true;
            }
            if (req.user.email == "engineer.shadirahhal@gmail.com") {
              director = 'yes';
            } else { director = '' }
          } else {
            login = false; confirmed = false;
          }
        }

      })
      const locals = {
        confirmed: confirmed,
        director: director,
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        paramsName: paramsName,
        paramsNameAdmin: paramsNameAdmin,
        login: login,
        title: "Dashboard",
        description: "Free platform of works, portfolio, and resume.",
        messageInform: messageInform,
        birthday: birthday,
        gender: gender,
        location: location,
        orderWorks: orderWorks,
        admin: admin,
        messageSuccess: messageSuccess,
      }
      try {
        var Sort;
        if (orderWorks == 'oldest') { Sort = +1 } else { Sort = -1 }
        Note.aggregate([
          {
            $sort: {
              updatedAt: Sort,
            }
          },
          { $match: { user: new mongoose.Types.ObjectId(userID) } },
          {
            $project: {
              title: { $substrCP: ['$title', 0, 50] },
              body: { $substrCP: ['$body', 0, 100] },
              image: { $substrCP: ['$image', 0, 150] },
              firstFileType: { $substrCP: ['$firstFileType', 0, 150] },
              createdAt: { $substrCP: ['$createdAt', 0, 50] },
              updatedAt: { $substrCP: ['$updatedAt', 0, 50] },
              userParamsName: { $substrCP: ['$userParamsName', 0, 50] },
              userFullName: { $substrCP: ['$userFullName', 0, 50] },
              align: { $substrCP: ['$align', 0, 7] },
              direction: { $substrCP: ['$direction', 0, 4] },
            }
          }
        ])
          .skip(perPage * page - perPage)
          .limit(perPage)
          .then((notes) => {
            Note.find({ userParamsName: req.params.user })
              .then((userNotes) => {
                count = userNotes.length;
                res.render('dashboard/index', {
                  username: userName,
                  name: userName,
                  locals,
                  notes,
                  layout: '../views/layouts/dashboard',
                  current: page,
                  pages: Math.ceil(count / perPage),
                  admin: admin,
                  searchResults: false,
                  works: works,
                }
                )
              })

          })

      } catch (error) {
        console.log(error)
      }
    })
})
router.get('/dashboard', (req, res, next) => {
  var messageInform = req.flash('inform');
  var count = 0;
  if (!req.user) {
    return res.redirect('/signin')
  }
  let perPage = 12;

  let page = req.query.page || 1;
  var login, confirmed, works, birthday, gender, location, paramsNameAdmin;
  var messageSuccess = req.flash('updateSuccess');
  if (req.user) {
    // console.log('req.user.paramsName: ', req.user.paramsName)
    paramsNameAdmin = req.user.paramsName;
    if (req.user.email == "engineer.shadirahhal@gmail.com") {
      director = 'yes';
    } else { director = '' }
    login = true; userName = req.user.fullName;
    paramsName = req.user.paramsName;
    Note.find({ user: req.user.id })
      .then((notes) => {
        works = notes
      })
  } else {
    login = false;; paramsNameAdmin = 'signin'; paramsName = 'signin';
  }
  const locals = {
    confirmed: req.user.confirmed,
    orderWorks: req.user.orderWorks,
    director: director,
    userName: userName,
    paramsName: 'paramsName',
    paramsNameAdmin: paramsNameAdmin,
    login: login,
    title: "Dashboard",
    description: "Free platform of works, portfolio, and resume.",
    messageInform: messageInform,
    birthday: req.user.birthday,
    gender: req.user.gender,
    location: req.user.location,
    messageSuccess: messageSuccess,
  }
  try {
    var orderWorks = req.user.orderWorks; var Sort;
    if (orderWorks == 'oldest') { Sort = +1 } else { Sort = -1 }
    Note.aggregate([
      {
        $sort: {
          updatedAt: Sort,
        }
      },
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $project: {
          title: { $substrCP: ['$title', 0, 30] },
          body: { $substrCP: ['$body', 0, 100] },
          image: { $substrCP: ['$image', 0, 150] },
          firstFileType: { $substrCP: ['$firstFileType', 0, 150] },
          createdAt: { $substrCP: ['$createdAt', 0, 50] },
          updatedAt: { $substrCP: ['$updatedAt', 0, 50] },
          userParamsName: { $substrCP: ['$userParamsName', 0, 50] },
          userFullName: { $substrCP: ['$userFullName', 0, 50] },
        }
      }
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .then((notes) => {
        //------------- Order By newest ---------------------------------
        // var notesArray = notes.sort();
        //------------- Order By oldest ---------------------------------
        // var notesArray = notes.reverse();

        Note.find({ user: req.user._id })
          .then((userNotes) => {
            count = userNotes.length;
            res.render('dashboard/index', {
              username: req.user.firstName,
              locals,
              notes,
              searchResults: false,
              layout: '../views/layouts/dashboard',
              current: page,
              pages: Math.ceil(count / perPage),
              admin: true,
              works: userNotes,
            }
            )
          })
      })
  } catch (error) {
    console.log(error)
  }
});
router.get('/contact', (req, res, next) => {
  var paramsName, login, email;
  var messageSuccess = req.flash('sentSuccess');
  if (req.user) {
    paramsName = req.user.paramsName;
    login = true;
    email = req.user.email;
  }
  else { paramsName = 'signin'; login = false; email = '' }
  const locals = {
    paramsNameAdmin: paramsName,
    login: login,
    email: email,
    messageSuccess: messageSuccess,
  }
  res.render('contact', { locals, })
});

router.post('/sendMessage', (req, res, next) => {
  if (req.body.message == '') {
    return res.status(204).send();
  }
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'engineer.shadirahhal@gmail.com',
      pass: 'xeod hhnl ygek beeh',
    }
  });
  var mailOptions = {
    from: req.body.from,
    to: req.body.to,
    subject: 'from: ' + req.body.from + ' ' + req.body.messageTitle,
    text: req.body.message,
  }
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("Error , You are not connected: ", err)
      // res.render("signup", { messages: 'You are not connected ' });
    } else {
      console.log("Sent successfully.");
      req.flash('sentSuccess', 'Message sent successfully.')
      res.redirect('back')
    }
  })
});
router.get('/:user', (req, res, next) => {
  var admin = login = confirmed = director = false;
  var userName, userID, email, firstName, lastName, image, speciality, education, skills, paramsName, location, gender, birthday, messagesError, messageSuccess, messageInform, password, paramsNameAdmin;
  var messagesError = messageSuccess = messageInform = '';
  User.find({})
    .then((users) => {
      if (req.user) {
        paramsNameAdmin = req.user.paramsName;
        messagesError = req.flash('signinError');
        messageSuccess = req.flash('updateSuccess');
        messageInform = req.flash('inform');
        login = true; confirmed = req.user.confirmed;
        password = req.user.password;
        if (req.user.email == "engineer.shadirahhal@gmail.com") {
          director = 'yes';
        } else { director = '' }
      } else {
        messagesError = messageSuccess = messageInform = 'aaa';
        paramsNameAdmin = 'signin';
      }
      users.forEach(user => {
        if (user.paramsName == req.params.user) {
          userID = String(user._id);
          userName = user.firstName + ' ' + user.lastName;
          email = user.email;
          firstName = user.firstName;
          lastName = user.lastName;
          paramsName = user.paramsName;
          image = user.image;
          speciality = user.speciality;
          education = user.education;
          skills = user.skills;
          birthday = user.birthday;
          gender = user.gender;
          location = user.location;
          if (req.user) {
            paramsNameAdmin = req.user.paramsName;
            login = true; confirmed = req.user.confirmed;
            password = req.user.password;
            if (user.email == req.user.email) {
              admin = true
            }
            if (req.user.email == "engineer.shadirahhal@gmail.com") {
              director = 'yes';
            } else { director = '' }
          } else {
            paramsNameAdmin = 'signin';
          }
        }
      });
      const locals = {
        messageSuccess: messageSuccess,
        messagesError: messagesError,
        messageInform: messageInform,
        password: password,
        email: email,
        image: image,
        firstName: firstName,
        lastName: lastName,
        confirmed: confirmed,
        director: director,
        userName: userName,
        paramsName: paramsName,
        paramsNameAdmin: paramsNameAdmin,
        login: login,
        admin: admin,
        speciality: speciality,
        education: education,
        skills: skills,
        birthday: birthday,
        gender: gender,
        location: location,
      }
      if (req.params.user == 'contact') { return res.render('./contact') }
      if (userID == null) {
        return res.status(404).render('404', { locals })
      }
      res.render('profile', {
        locals,
      })
    })
});

router.get('/:user/resume', (req, res, next) => {
  var admin = login = confirmed = director = false;
  var userName, userID, email, firstName, lastName, image, paramsName, paramsNameAdmin;
  if (req.user) { paramsNameAdmin = req.user.paramsName }
  else { paramsNameAdmin = "signin" }
  var messageSuccess = req.flash('updateSuccess');
  var messagesError = req.flash('updateError');
  User.find({})
    .then((users) => {
      users.forEach(user => {
        if (user.paramsName == req.params.user) {
          userID = String(user._id);
          userName = user.firstName + ' ' + user.lastName;
          email = user.email;
          firstName = user.firstName;
          lastName = user.lastName;
          paramsName = user.paramsName;
          resume = user.resume;
          if (req.user) {
            login = true;
            if (user.email == req.user.email) {
              admin = true
            }
            if (req.user.email == "engineer.shadirahhal@gmail.com") {
              director = 'yes';
            } else { director = '' }
          } else {
            login = false; confirmed = false;
          }
        }
      });
      // if (userID == null) { return res.send('NOT A USER') }

      const locals = {
        messagesError: messagesError,
        messageSuccess: messageSuccess,
        email: email,
        resume: resume,
        firstName: firstName,
        lastName: lastName,
        confirmed: confirmed,
        director: director,
        userName: userName,
        paramsName: paramsName,
        paramsNameAdmin: paramsNameAdmin,
        login: login,
        admin: admin,
      }
      res.render('cv', {
        locals,
      })
    })
});

router.post('/searchUsersResult', async (req, res, next) => {
  var users = []; var refused = 0;
  var education, skills, speciality, paramsNameAdmin;
  var searchTerm = req.body.searchTerm.trim();
  var kind = String(req.body.kind);
  if (req.user) {
    paramsNameAdmin = req.user.paramsName
  } else { paramsNameAdmin = 'users' }
  User.find({}).then((Allusers) => {
    for (let u = 0; u < Allusers.length; u++) {
      refused = 0;
      for (let i = 0; i < req.body.searchTerm.length; i++) {
        if (kind == 'fullName') {
          if ((Allusers[u].fullName).toLowerCase()[i] != req.body.searchTerm.toLowerCase()[i] || Allusers[u].fullName.length == 0) { refused++ }
        } else if (kind == 'email') {
          if ((Allusers[u].email).toLowerCase()[i] != req.body.searchTerm.toLowerCase()[i] || Allusers[u].email.length == 0) { refused++ }
        } else if (kind == 'speciality') {
          if (Allusers[u].speciality) {
            speciality = Allusers[u].speciality.split(',');
          }
          if (Allusers[u].speciality.length > 0) {
            for (let n = 0; n < speciality.length; n++) {
              refused = 0;
              for (let m = 0; m < req.body.searchTerm.length; m++) {
                if (speciality[n].trim().toLowerCase()[m] != req.body.searchTerm.trim().toLowerCase()[m] || Allusers[u].speciality.length == 0) { refused++ }
              }
              if (refused == 0) { break }
            }
          } else {
            refused = 1;
          }
        } else if (kind == 'education') {
          if (Allusers[u].education) {
            education = Allusers[u].education.split(',');
          }
          if (Allusers[u].education.length > 0) {
            for (let n = 0; n < education.length; n++) {
              refused = 0;
              for (let m = 0; m < req.body.searchTerm.length; m++) {
                if (education[n].trim().toLowerCase()[m] != req.body.searchTerm.trim().toLowerCase()[m] || Allusers[u].education.length == 0) { refused++ }
              }
              if (refused == 0) { break }
            }
          } else {
            refused = 1
          }
        } else if (kind == 'skills') {
          if (Allusers[u].skills) {
            skills = Allusers[u].skills.split(',');
          }
          if (Allusers[u].skills.length > 0) {
            for (let n = 0; n < skills.length; n++) {
              refused = 0;
              for (let m = 0; m < req.body.searchTerm.length; m++) {
                if (skills[n].trim().toLowerCase()[m] != req.body.searchTerm.trim().toLowerCase()[m] || Allusers[u].skills.length == 0) { refused++ }
              }
              if (refused == 0) { break }
            }
          } else {
            refused = 1
          }
        }
      }
      if (refused == 0) { users.push(Allusers[u]) }
    }
    if (req.body.searchTerm.length == 0) {
      users = []; return res.status(204).send();
    }
    resultCount = users.length;

    Note.find({}).then((notes) => {
      if (req.user) { login = true } else { login = false }
      const locals = {
        paramsName: 'users',
        paramsNameAdmin: paramsNameAdmin,
        users: users,
        notes: notes,
        login: login,
      }
      res.render('users', {
        users: users,
        notes: notes,
        resultCount: resultCount,
        locals,
      })
    })
  })
});

router.post('/:paramsName/works/sort', async (req, res, next) => {
  const updateUser = {
    orderWorks: req.body.sort,
  }
  const doc = User.findOneAndUpdate({ _id: req.user._id }, { $set: updateUser }, { $upset: true })
    .then((user) => {
      res.redirect('back')
    })
});

//____________ search Works Result ___________________________________
router.post('/:paramsName/works/result', async (req, res, next) => {
  try {
    var thisUserParamsName = req.params.paramsName;
    var login, director, note, paramsNameAdmin;
    let userID;
    if (req.user) {
      login = true; paramsNameAdmin = req.user.paramsName;
      userName = req.user.firstName + ' ' + req.user.lastName
      if (req.user.email == "engineer.shadirahhal@gmail.com") {
        director = 'yes';
      } else { director = '' }
    } else { login = false; userName = ''; paramsNameAdmin = 'signin' }
    const locals = {
      paramsName: thisUserParamsName,
      paramsNameAdmin: paramsNameAdmin,
      userName: userName,
      login: login,
      director: director,
      title: "Dashboard",
      description: "Free platform of works, portfolio, and resume."
    }
    var note = '';
    let searchTerm = req.body.searchTerm;
    // const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    if (searchTerm.length == 0) {
      return res.status(204).send();// This doesn't redirect , or:
      // return res.redirect(req.get('referer')); // This do redirect , or:
      // return res.redirect('back'); // This do redirect
    }
    var works = String(req.body.works);
    var searchResults;
    if (works == 'myWorks' || (!req.body.thisUserParamsName && works == 'thisUser')) {
      if (!req.user) {
        return res.status(204).send();
      }
      searchResults = await Note.find({
        $or: [
          {
            title: { $regex: new RegExp(searchTerm, 'i') },
            user: req.user.id
          },
          // {
          //     body: { $regex: new RegExp(searchTerm, 'i') },
          //     user: req.user.id
          // },
        ]
      }).then((notes) => {
        res.render('dashboard/index', {
          pages: '',
          current: '',
          name: req.user.firstName + ' ' + req.user.lastName,
          admin: '',
          userID: '',
          locals,
          searchResults,
          notes: notes,
          works: notes,
          layout: '../views/layouts/dashboard'
        })
      })
    } else if (works == 'allWorks') {
      searchResults = await Note.find({
        $or: [
          {
            title: { $regex: new RegExp(searchTerm, 'i') },
          },
        ]
      }).then((notes) => {
        res.render('dashboard/index', {
          pages: '',
          current: '',
          name: 'Users',
          admin: '',
          userID: '',
          locals,
          searchResults,
          notes: notes,
          works: notes,
          layout: '../views/layouts/dashboard'
        })

      })
    } else if (works == 'thisUser') {
      User.findOne({ paramsName: thisUserParamsName })
        .then((theUser) => {
          if (theUser) {
            var paramsName = theUser.paramsName;
            userID = theUser._id
          } else {
            return res.status(204).send();
          }
          searchResults = Note.find({
            $or: [
              {
                title: { $regex: new RegExp(searchTerm, 'i') },
                user: userID
              },
            ]
          }).then((notes) => {
            // return res.status(204).send();
            return res.render('dashboard/index', {
              admin: '',
              pages: '',
              current: '',
              name: theUser.firstName + ' ' + theUser.lastName,
              userID: '',
              locals,
              searchResults,
              notes: notes,
              works: notes,
              layout: '../views/layouts/dashboard',
              paramsName: thisUserParamsName
            })
          })
        })
    }
  } catch (error) {
    console.log(error)
  }
});

router.post('/sort', (req, res, next) => {
  const updateUser = {
    orderWorks: req.body.sort,
  }
  const doc = User.findOneAndUpdate({ _id: req.user._id }, { $set: updateUser }, { $upset: true })
    .then((user) => {
      res.redirect('back')
    })
});

router.post('/*/sort', (req, res, next) => {
  const updateUser = {
    orderWorks: req.body.sort,
  }
  const doc = User.findOneAndUpdate({ _id: req.user._id }, { $set: updateUser }, { $upset: true })
    .then((user) => {
      res.redirect('back')
    })
});




function sendLinkFunction(req, res, next) {
  var user = req.user;
  var sendLink = user.sendLink;
  if (sendLink < 100) {
    const secret = JWT_SECRET + user.password
    const payload = {
      email: req.body.email,
      id: user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '1080m' });
    link = `https://works-iikg.onrender.com/confirmEmail/${user._id}/${token}`;
    // const link = `http://localhost:5000/confirmEmail/${user._id}/${token}`;
    console.log('link: ', link);
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
      to: req.body.email,
      subject: "Confirm Email",
      text: `Click this link to confirm your email 
                 ` + link

    }
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("Error , You are not connected: ", err)
        // res.render("signup", { messages: 'You are not connected ' });
      } else {
        console.log("A confirmation link has been sent to your email");

      }
    })
    // ************* end sending email *****************************
    User.updateOne({ _id: user._id }, { $set: { sendLink: sendLink + 1 } })
      .catch((err) => { res.redirect('profile') })
      .then(() => {
        return res.redirect('profile')
      })
  }
  else {
    return res.send('<h1 style="color:crimson;text-align:center;padding:20px">A link was sent 10 times, if you lost their you have to delete your account and sign up again.</h1>')
  }
}
module.exports = router;
