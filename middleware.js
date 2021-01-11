const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews');

module.exports.isUserAuthenticated = (req, res, next) => {
    // console.log('Current user...', req.user);
    // console.log('Current user...', req.path, req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'SignIn or Register to access Campgrounds.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find the Campground.');
        return res.redirect('/campgrounds');
    }
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission on this Campground.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash('error', 'Cannot find the Review.');
        return res.redirect(`/campgrounds/${id}`);
    }
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit/delete this review.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}