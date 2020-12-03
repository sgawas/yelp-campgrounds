const express = require('express');
const passport = require('passport');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { isUserAuthenticated } = require('../middleware');
const { register, renderLogin, renderRegister, login, logout} = require('../controllers/users');

const router = express.Router();

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(register));

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local',
        { failureFlash: 'Incorrect username or password.', failureRedirect: '/login' }), 
        catchAsync(login));

router.get('/new', isUserAuthenticated, (req, res) => {
    res.redirect('/campgrounds/new');
})

router.get('/logout', logout)

module.exports = router;