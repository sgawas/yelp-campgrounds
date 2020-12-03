if( process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
console.log(process.env.CLOUDINARY_NAME);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localPassport = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const User = require('./models/user');

const app = express();

const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}

mongoose.connect('mongodb://localhost:27017/yelp-camp', 
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> {
    console.log('connected to mongo db');
})
.catch(err=> {
    console.log('error connecting mongodb');
    console.log(err);
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res)=> {
    res.render('home');
});

app.all('*',(req, res, next)=> {
    next(new ExpressError('Page not found.', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message){
        err.message = 'Something went wrong.'
    }
    res.status(statusCode).render('error', { err });
});

app.listen(3000, ()=> {
    console.log('listening on 3000');
});