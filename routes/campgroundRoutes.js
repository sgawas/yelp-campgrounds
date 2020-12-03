const express = require('express');
const multer  = require('multer')

const { storage, cloudinary } = require('../cloudinary');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isUserAuthenticated, isAuthor, validateCampground } = require('../middleware');
const { index, renderNewForm, showCampground, createCampground, 
    renderEditForm, editCampground, deleteCampground } = require('../controllers/campgrounds');

const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(index)
    .post(isUserAuthenticated, upload.array('image'), validateCampground, catchAsync(createCampground));
    // .post(upload.single('image'), function (req, res, next) {
    //     console.log(req.body, req.file);
    //     res.send("Hello");   
    // })
    // .post(upload.array('image', 3), function (req, res, next) {
    //     console.log(req.body, req.file);
    //     res.send("Hello");
    // });

router.get('/new', isUserAuthenticated, renderNewForm);

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isUserAuthenticated, isAuthor, upload.array('image'), validateCampground, catchAsync(editCampground))
    .delete(isUserAuthenticated, isAuthor, deleteCampground);

router.get('/:id/edit', isUserAuthenticated, isAuthor, renderEditForm);

module.exports = router;