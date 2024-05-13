const mongoose = require('mongoose');
const Note = require('../models/Notes')
const User = require('../models/User')
require('../routes/auth');
const passport = require('passport');
var express = require('express');
const router = express.Router();
const fs = require('fs');
const csrf = require('csurf');
const multer = require('multer');
// _____________________________ Upload Image ________________________________
const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) { // cb => callback function
        var dir = './public/img/notes';
        if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() + new Date().getTime() + file.originalname)
    }
})
var upload = multer({ storage: storageEngine }).array('images', 12)
var uploadadd = multer({ storage: storageEngine }).array('imagesNotes', 12)

exports.dashboardViewNote = (req, res) => {
    var messageSuccess;
    messageSuccess = req.flash('updateSuccess');
    try {
        const note = Note.find({})
            .then((works) => {
                console.log('req.params: ', req.params)
                var paramsID = req.params.id;
                var admin = false;
                var login, director, image, userFullName, paramsName, paramsNameAdmin, align, direction;
                var title1 = body1 = userFullName = userParamsName = images = groupImages1 = align = direction = '';
                if (req.user) {
                    paramsNameAdmin = req.user.paramsName;
                    login = true;
                    userName = req.user.firstName;
                    image = req.user.image;
                    if (req.user.email == "engineer.shadirahhal@gmail.com") {
                        director = 'yes';
                    } else { director = '' }
                } else {
                    login = false; director = ''; userName = '';
                    paramsNameAdmin = 'signin';
                }
                n = 0;
                if (works) {
                    works.forEach(work => {
                        if (work._id == paramsID) {
                            title1 = work.title;
                            body1 = work.body;
                            userFullName = work.userFullName;
                            userParamsName = work.userParamsName;
                            images = work.image;
                            groupImages1 = work.groupImages;
                            align = work.align;
                            direction = work.direction;
                            if (req.user) {
                                if (String(work.user) == String(req.user._id)) {
                                    admin = true;
                                }
                            }
                        }
                    })
                    if (title1 == '') {
                        return res.status(404).render('404')
                    }
                    const locals = {
                        paramsName: userParamsName,
                        paramsNameAdmin: paramsNameAdmin,
                        userName: userName,
                        director: director,
                        login: login,
                        image: image,
                        title: "Dashboard",
                        description: "Free platform of works, portfolio, and resume.",
                        align: align,
                        direction: direction,
                        messageSuccess: messageSuccess,
                    }
                    return res.render('dashboard/view-notes', {
                        locals,
                        noteID: paramsID,
                        note_id: paramsID,
                        note: works,
                        layout: '../views/layouts/dashboard',
                        title: title1,
                        body1: body1,
                        userFullName: userFullName,
                        userParamsName: userParamsName,
                        images: images,
                        groupImages1: groupImages1,
                        admin: admin
                    });

                }
                else {
                    return res.send("Something went wrong, no result")
                }
            })

    } catch (error) {
        return res.send(error)
    }
}
exports.dashboardAddImages = async (req, res, next) => { // UpdateNote
    uploadadd(req, res, function (err) {
        var updateNote, firstFileType, reqFiles;
        const userParamsName = req.user.paramsName;
        Note.findOne({ _id: req.body.note_id })
            .then((note) => {
                if (req.files.length == 0) {
                    // console.log('req.files.length == 0:', req.files)
                    updateNote = {
                        body: req.body.body1,
                        title: req.body.title,
                        updatedAt: Date.now(),
                        align: req.body.align,
                        direction: req.body.direction,
                    }
                } else {
                    reqFiles = req.files;
                    if (note.groupImages.length > 0) {
                        for (let i = 0; i < note.groupImages.length; i++) {
                            reqFiles.unshift(note.groupImages[i])
                        }
                    }
                    // console.log('reqFiles :', reqFiles);
                    // console.log('note.groupImages :', note.groupImages);
                    // console.log('req.files :', req.files)
                    image = reqFiles[0].path.slice(6);
                    firstFileType = reqFiles[0].mimetype;
                    console.log('firstFileType: ', firstFileType)
                    updateNote = {
                        body: req.body.body1,
                        title: req.body.title,
                        updatedAt: Date.now(),
                        groupImages: reqFiles,
                        firstFileType: firstFileType,
                        image: image,
                        align: req.body.align,
                        direction: req.body.direction,
                    }
                    // console.log('updateNote :', updateNote)
                }
                const doc = Note.findOneAndUpdate({ _id: req.body.note_id }, { $set: updateNote })
                    .then((Successful) => {
                        // console.log('Successful :', Successful)
                        req.flash('updateSuccess', "Successfully updated !");
                        return res.redirect('back')
                    });
                if (!doc) { console.log('Not Successful: no doc') }
                else { console.log('Successfully updated: ', doc) }
            })
    })
}
exports.dashboardDeleteImage = async (req, res, next) => {
    // console.log('req.body:', req.body)
    Note.findOne({ _id: req.body.note })
        .then((note) => {
            var updateNote, image;
            var imgs = note.groupImages;
            for (let i = 0; i < imgs.length; i++) {
                // console.log(imgs[i].path)
                if (imgs[i].path == req.body.imagePath) {
                    fs.unlink('./' + imgs[i].path, (err) => { });
                    imgs.splice(i, 1);
                    if (imgs.length > 0) {
                        image = imgs[0].path.slice(6);
                        firstFileType = imgs[0].mimetype;
                    } else { image = ''; firstFileType = '' }
                    updateNote = {
                        "updatedAt": Date.now(),
                        groupImages: imgs,
                        image: image,
                        firstFileType: firstFileType,
                    }

                }
            }
            const doc = Note.findOneAndUpdate({ _id: req.body.note }, { $set: updateNote })
                .then(() => {
                    req.flash('updateSuccess', "Successfully deleted !");
                    res.redirect('back')
                })
        })
}
exports.dashboardMainImage = async (req, res, next) => {
    const userParamsName = req.user.paramsName;
    Note.findOne({ _id: req.body.note })
        .then((note) => {
            var updateNote, image;
            var imgs = note.groupImages;
            const imgsMoved = imgs[0];
            for (let i = 0; i < imgs.length; i++) {
                if (imgs[i].path == req.body.imagePath) {
                    imgs[0] = imgs[i];
                    imgs[i] = imgsMoved;
                    image = imgs[0].path.slice(6)
                    updateNote = {
                        groupImages: imgs,
                        image: image,
                        firstFileType: imgs[0].mimetype,
                    }
                }
            }
            const doc = Note.findOneAndUpdate({ _id: req.body.note }, { $set: updateNote })
                .then(() => {
                    return res.redirect('../' + userParamsName + '/works')
                })
        })
}
exports.dashboardDeleteNote = (req, res, next) => {
    var userParamsName = req.user.paramsName;
    try {
        Note.findOne({ _id: req.body.note_id })
            .then((note) => {
                // console.log('note:::::::::::::; ', note)
                if (note.groupImages.length > 0) {
                    note.groupImages.forEach(img => {
                        // console.log('img.path: ', img.path)
                        fs.unlink('./' + img.path, (err) => { })
                    })
                }
            })
        const doc = Note.deleteOne({ _id: req.body.note_id })
            .then((Successful) => {
                req.flash('updateSuccess', "Successfully deleted !");
                return res.redirect('../../' + userParamsName + '/works')
            });

    } catch (error) {
        console.log('error:::', error)
    }
}
exports.dashboardDeleteAllNotes = (req, res, next) => {
    var userParamsName = req.user.paramsName;
    try {
        Note.find({ user: req.user._id })
            .then((notes) => {
                notes.forEach(note => {
                    note.groupImages.forEach(img => {
                        // console.log('img.path: ', img.path)
                        fs.unlink('./' + img.path, (err) => { })
                    })
                })
            })
        const doc = Note.deleteMany({ user: req.user._id })
            .then((Successful) => {
                console.log('Successful deleted !: ', Successful)
            });
        if (!doc) { console.log('Not Successful: no doc') }
        else { req.flash('updateSuccess', "Successfully deleted !"); }
        return res.redirect('../../' + userParamsName + '/works')
    } catch (error) {
        console.log('error:::', error)
    }
}
exports.dashboardAddNote = async (req, res, next) => {
    var messageInform = req.flash('inform');
    var login, director, images, groupImages1;
    if (req.user) {
        login = true; userName = req.user.firstName;
        paramsNameAdmin = req.user.paramsName;
    }
    else { login = false; paramsNameAdmin = 'signin' }
    if (req.user.email == "engineer.shadirahhal@gmail.com") {
        director = 'yes';
    } else { director = '' }
    Note.find({})
        .then((result) => {
            if (result) {
                result.forEach(element => {
                    var paramsID = req.params.id;
                    if (element._id == paramsID && (String(element.user) == String(req.user._id) || req.user.email == 'engineer.shadirahhal@gmail.com')) {
                        images = element.image;
                        groupImages1 = element.groupImages;
                    }
                })
            }
        })
    const locals = {
        paramsNameAdmin: paramsNameAdmin,
        groupImages1: groupImages1,
        images: images,
        login: login,
        director: director,
        login: login,
        title: "Dashboard",

    }
    if (req.user.confirmed == 'true') {
        res.render('dashboard/add', {
            locals,
            layout: '../views/layouts/dashboard'
        })
    } else {
        req.flash('inform', "You have to confirm your email.");
        return res.redirect('back');
    }

};

exports.dashboardAddNoteSubmit = async (req, res, next) => {
    try {
        upload(req, res, function (err) {
            if (err) { res.send("Somthing Error") }
            var reqFiles, image, updateUser, firstFileType;
            var userParamsName = req.user.paramsName;

            if (req.files.length == 0) { reqFiles = [] }
            else {
                reqFiles = req.files;
                image = req.files[0].path.slice(6);
                firstFileType = req.files[0].mimetype;
            }
            // console.log('req.params: ', req.params)
            // console.log('req.body: ', req.body)
            req.body.user = req.user.id;
            Note.create({
                userEmail: req.user.email,
                userFullName: req.user.fullName,
                userParamsName: userParamsName,
                user: req.user,
                body: req.body.body1,
                title: req.body.title,
                image: image,
                groupImages: reqFiles,
                firstFileType: firstFileType,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                align: req.body.align,
                direction: req.body.direction,
            }).then((n) => {
                console.log('newNote: ', n)
                Note.find({ userEmail: req.user.email }).then((notes1) => {
                    updateUser = {
                        works: notes1,
                    }
                    // console.log('notes1:', notes1)
                    // console.log('updateUser:', updateUser)
                    User.findOneAndUpdate({ _id: req.user.id }, { $set: updateUser })
                        .then(() => {
                            req.flash('updateSuccess', "Successfully added !");
                            return res.redirect('../' + userParamsName + '/works/' + n._id)
                        })
                })
            })
        })
    } catch (error) {
        console.log(error)
    }
}

