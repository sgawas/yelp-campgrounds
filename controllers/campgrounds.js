const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res)=> {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res)=> {
    res.render('campgrounds/new');
};

module.exports.showCampground = async( req, res)=> {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({ 
            path: 'reviews', 
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find the Campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.createCampground = async (req, res)=> {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(file => ({url: file.path, filename:  file.filename}));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully added a new Campground.');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.renderEditForm = async( req, res)=> {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find the Campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res)=> {
    const { id } = req.params;
    if(!req.body.campground) {
        throw new ExpressError('Invalid Campground Data.', 400);
    }
    //const campground = await Campground.findById(id);
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true, runValidators: true });
    const images = req.files.map(file => ({url: file.path, filename:  file.filename}));
    camp.images.push(...images);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully update the Campground.')
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res)=> {
    const { id } = req.params;
    await Campground.findByIdAndDelete({_id: id});
    res.redirect(`/campgrounds`);
};