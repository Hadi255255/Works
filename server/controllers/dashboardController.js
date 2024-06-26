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
const { link } = require('fs/promises');
const cloudinary = require('../cloudinary');

// _____________________________ Upload Image ________________________________
const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) { // cb => callback function
        var dir = './public/img/notes';
        if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() + new Date().getTime() + file.originalname)
    },
})
var upload = multer({ storage: storageEngine }).array('images', 12)
var uploadadd = multer({ storage: storageEngine }).array('imagesNotes', 12)

exports.dashboardViewNote = (req, res) => {
    var messageSuccess;
    messageSuccess = req.flash('updateSuccess');
    try {
        const note = Note.find({})
            .then((works) => {
                var paramsID = req.params.id;
                var admin = false;
                var login, director, image, userFullName, paramsName, paramsNameAdmin, align, direction, links;
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
                            links = work.links;
                            if (req.user) {
                                if (String(work.user) == String(req.user._id)) {
                                    admin = true;
                                }
                            }
                        }
                    })
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
                        links: links,
                    }
                    if (title1 == '') {
                        return res.status(404).render('404', { locals })
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
        // set the date to show in PST timezone
        let date = new Date();
        let timezoneOffset, pstDateTime, adjustedTime;
        let options = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            // timeZone: 'Asia/Damascus'
        };
        if (req.user.timeZone != null && req.user.timeZone != undefined && req.user.timeZone != "") {
            timezoneOffset = req.user.timeZone;
            adjustedTime = new Date(+date + +timezoneOffset * 60 * 1000);
            pstDateTime = adjustedTime.toUTCString();
            updatedAt = String(pstDateTime)
        } else {
            var updatedAt = +(Date.now());
            updatedAt -= +(new Date().getTimezoneOffset()) * 60 * 1000;
        }
        // End setting date
        var inputValue = req.body.inputValue;
        var inputTitle = req.body.inputTitle;
        var linksValuesArray = [];
        var linksTitlesArray = [];
        if (typeof inputValue == 'string') {
            linksValuesArray.push(inputValue)
        } else if (typeof inputValue == 'object') {
            for (let i = 0; i < inputValue.length; i++) {
                linksValuesArray.push(inputValue[i])
            }
        }
        if (typeof inputTitle == 'string') {
            linksTitlesArray.push(inputTitle)
        } else if (typeof inputTitle == 'object') {
            for (let i = 0; i < inputTitle.length; i++) {
                linksTitlesArray.push(inputTitle[i])
            }
        }
        Note.findOne({ _id: req.body.note_id })
            .then((note) => {
                if (note.links) {
                    linksTitlesArray = note.links.linkTitle.concat(linksTitlesArray);
                    linksValuesArray = note.links.linkValue.concat(linksValuesArray);
                }
                if (req.files.length == 0) {
                    updateNote = {
                        body: req.body.body1,
                        title: req.body.title,
                        updatedAt: updatedAt,
                        align: req.body.align,
                        direction: req.body.direction,
                        links: {
                            linkTitle: linksTitlesArray,
                            linkValue: linksValuesArray,
                        },
                    }
                } else {
                    reqFiles = req.files;
                    if (note.groupImages.length > 0) {
                        for (let i = 0; i < note.groupImages.length; i++) {
                            reqFiles.unshift(note.groupImages[i])
                        }
                    }
                    image = reqFiles[0].path.slice(6);
                    firstFileType = reqFiles[0].mimetype;
                    // try {
                    //     reqFiles.forEach((file) => {
                    //         const uploadResult = cloudinary.uploader.upload(file.path, {
                    //             public_id: file.filename
                    //         }).catch((error) => { console.log(error) })
                    //             .then((result) => { console.log('Successful upload to cloudinary: ', result) })

                    //         console.log('uploadResult: ', uploadResult);
                    //     })
                    // }
                    // catch {
                    //     console.log('Forbidden');
                    // }

                    updateNote = {
                        body: req.body.body1,
                        title: req.body.title,
                        updatedAt: Date.now(),
                        groupImages: reqFiles,
                        firstFileType: firstFileType,
                        image: image,
                        align: req.body.align,
                        direction: req.body.direction,
                        links: {
                            linkTitle: linksTitlesArray,
                            linkValue: linksValuesArray,
                        },
                    }
                }
                const doc = Note.findOneAndUpdate({ _id: req.body.note_id }, { $set: updateNote })
                    .then((Successful) => {
                        req.flash('updateSuccess', "Successfully updated !");
                        return res.redirect('back')
                    });
                if (!doc) { console.log('Not Successful: no doc') }

            })
    })
}
exports.dashboardDeleteImage = async (req, res, next) => {
    Note.findOne({ _id: req.body.note })
        .then((note) => {
            var updateNote, image;
            var imgs = note.groupImages;
            for (let i = 0; i < imgs.length; i++) {
                if (imgs[i].path == req.body.imagePath) {
                    fs.unlink('./' + imgs[i].path, (err) => { });
                    // try {
                    //     const deletResult = cloudinary.uploader.destroy(imgs[i].filename)
                    //         .catch((error) => { console.log(error) })
                    //         .then((result) => { console.log('Successful deleted from cloudinary: ', result) })
                    // } catch {
                    //     console.log('Forbidden');
                    // }
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
                if (note.groupImages && note.groupImages.length > 0) {
                    note.groupImages.forEach(img => {
                        fs.unlink('./' + img.path, (err) => { })
                        // try {
                        //     const deletResult = cloudinary.uploader.destroy(img.filename)
                        // }
                        // catch {
                        //     console.log('Forbidden');
                        // }
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
                        fs.unlink('./' + img.path, (err) => { })
                        // try {
                        //     const deletResult = cloudinary.uploader.destroy(img.filename)
                        // }
                        // catch {
                        //     console.log('Forbidden');
                        // }
                    })
                })
            })
        const doc = Note.deleteMany({ user: req.user._id })
            .then((Successful) => { });
        if (!doc) { console.log('Not Successful: no doc') }
        else { req.flash('updateSuccess', "Successfully deleted !"); }
        return res.redirect('../../' + userParamsName + '/works')
    } catch (error) {
        console.log('error:::', error)
    }
}
exports.dashboardAddNote = async (req, res, next) => {
    var messageInform = req.flash('inform');
    var login, director, images, groupImages1, paramsName, paramsNameAdmin;
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
        paramsName: req.params.paramsName,
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
        req.flash('inform', "You have to confirm your email");
        return res.redirect('back');
    }

};

exports.dashboardAddNoteSubmit = async (req, res, next) => {
    try {
        upload(req, res, function (err) {
            if (err) { res.send("Somthing Error") }
            var reqFiles, image, updateUser, firstFileType, updatedAt, createdAt;
            var userParamsName = req.user.paramsName;
            // set the date to show in PST timezone
            let date = new Date();
            let timezoneOffset, pstDateTime, adjustedTime;
            let options = {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                // timeZone: 'Asia/Damascus'
            };
            if (req.user.timeZone != null && req.user.timeZone != undefined && req.user.timeZone != "") {
                timezoneOffset = req.user.timeZone;
                adjustedTime = new Date(+date + +timezoneOffset * 60 * 1000);
                pstDateTime = adjustedTime.toUTCString();
                updatedAt = createdAt = String(pstDateTime)
            } else {
                updatedAt = createdAt = +(Date.now());
                updatedAt -= +(new Date().getTimezoneOffset()) * 60 * 1000;
            }
            // End setting date
            if (req.files.length == 0) { reqFiles = [] }
            else {
                reqFiles = req.files;
                image = req.files[0].path.slice(6);
                firstFileType = req.files[0].mimetype;
                // try {
                //     reqFiles.forEach((file) => {
                //         const uploadResult = cloudinary.uploader.upload(file.path, {
                //             public_id: file.filename
                //         }).catch((error) => { console.log(error) })
                //             .then((result) => { console.log('Successful upload to cloudinary: ', result) })
                //         console.log('uploadResult: ', uploadResult);
                //     })
                // }
                // catch {
                //     console.log('Forbidden');
                // }
            }
            req.body.user = req.user.id;
            //____________________ Adding links ____________________________________
            var inputValue = req.body.inputValue;
            var inputTitle = req.body.inputTitle;
            var linksValuesArray = [];
            var linksTitlesArray = [];
            if (typeof inputValue == 'string') {
                linksValuesArray.push(inputValue)
            } else if (typeof inputValue == 'object') {
                for (let i = 0; i < inputValue.length; i++) {
                    linksValuesArray.push(inputValue[i])
                }
            }
            if (typeof inputTitle == 'string') {
                linksTitlesArray.push(inputTitle)
            } else if (typeof inputTitle == 'object') {
                for (let i = 0; i < inputTitle.length; i++) {
                    linksTitlesArray.push(inputTitle[i])
                }
            }
            // __________________________End Adding links___________________________________
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
                createdAt: createdAt,
                updatedAt: updatedAt,
                align: req.body.align,
                direction: req.body.direction,
                links: {
                    linkTitle: linksTitlesArray,
                    linkValue: linksValuesArray,
                },
            }).then((n) => {
                Note.find({ userEmail: req.user.email }).then((notes1) => {
                    updateUser = {
                        works: notes1,
                    }
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

exports.dashboardDeleteLink = (req, res, next) => {
    var paramsID;
    if (typeof req.body.paramsWork == 'string') {
        paramsID = req.body.paramsWork;
    } else {
        paramsID = req.body.paramsWork[0];
    }
    var linkNumber = req.body.n
    Note.findOne({ _id: paramsID })
        .then((note) => {
            var linksTitlesArray = note.links.linkTitle
            var linksValuesArray = note.links.linkValue
            linksTitlesArray.splice(linkNumber, 1)
            linksValuesArray.splice(linkNumber, 1)
            var links = {
                linkTitle: linksTitlesArray,
                linkValue: linksValuesArray,
            }
            updateNote = {
                links: {
                    linkTitle: linksTitlesArray,
                    linkValue: linksValuesArray,
                }
            }
            Note.findOneAndUpdate({ _id: paramsID }, { $set: updateNote })
                .then((theNote) => {
                    res.redirect('back')
                })

        })

}
