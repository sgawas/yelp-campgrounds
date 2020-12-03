const { string } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewsSchema = new Schema ({
    body: {
        type: String,
        trim: true,
        required: true
    },
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Reviews', reviewsSchema);