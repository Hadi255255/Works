const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/checkAuth');
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

router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
router.get('/:paramsName/works/add', isLoggedIn, dashboardController.dashboardAddNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.post('/:paramsName/works/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.post('/dashboard/addImages', isLoggedIn, dashboardController.dashboardAddImages);
router.post('/dashboard/delImage', isLoggedIn, dashboardController.dashboardDeleteImage);
router.post('/dashboard/mainImage', isLoggedIn, dashboardController.dashboardMainImage);
router.get('/:userParamsName/works/:id', dashboardController.dashboardViewNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.dashboardDeleteNote);
router.delete('/dashboard/items-delete', isLoggedIn, dashboardController.dashboardDeleteAllNotes);
router.post('/dashboard/deleteLink', isLoggedIn, dashboardController.dashboardDeleteLink);

module.exports = router;
