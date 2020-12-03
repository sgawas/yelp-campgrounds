const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./reviews');

const { Schema } = mongoose;

const ImageSchema = new Schema({
    filename: String,
    url: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    images: [ ImageSchema ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reviews'
        }
    ]
}, {
    toJSON: {
        transform(doc, ret){
            ret.id= ret._id,
            delete ret._id;
            delete ret.__v;
        }
    }
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }    
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;