const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places} = require('./seedsHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', 
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> {
    console.log('connected to mongo db');
})
.catch(err=> {
    console.log('error connecting mongodb');
    console.log(err);
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*50) + 10; 
        const camp = new Campground({
            author: '5fc58206aebaaf3abd58e0e9',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            images:[
                { 
                    url: 'https://res.cloudinary.com/dutkizxmn/image/upload/v1606957129/YelpCamp/kg8ujpkn1aqip71zkcu9.jpg',
                    filename: 'YelpCamp/kg8ujpkn1aqip71zkcu9.jpg' },
                { 
                    url: 'https://res.cloudinary.com/dutkizxmn/image/upload/v1606955103/YelpCamp/tt3s9nitcjfuul4msexk.jpg',
                    filename: 'YelpCamp/tt3s9nitcjfuul4msexk.jpg' },
                { 
                    url: 'https://res.cloudinary.com/dutkizxmn/image/upload/v1606953091/YelpCamp/xsasxcekuyjzrpdbqfqn.jpg',
                    filename: 'YelpCamp/xsasxcekuyjzrpdbqfqn.jpg' 
                } 
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae fuga incidunt aut nihil amet officiis, cumque necessitatibus ullam assumenda ab quos iste illum optio illo reiciendis earum facere odio porro!',
            geometry: {
                type: 'Point',
                coordinates: [ -122.9898, 45.5229 ]
            }
        })
        await camp.save();
    }
    console.log('records inserted');
}

// Campground.deleteMany({})
// .then(res=>{
//     console.log(res);
// })
// .catch(e=>{
//     console.log(e);
// })
seedDB()
.then(()=> {
    mongoose.connection.close();
})