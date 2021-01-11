# yelp-campground
https://floating-dusk-09578.herokuapp.com/campgrounds

## Dependencies
1. Create account on https://cloudinary.com/  
    a. Get cloudinary account name and store in env variable CLOUDINARY_NAME
    b. Get cloudinary api key and store in env variable CLOUDINARY_KEY
    c. Get cloudinary api secret and store in env variable CLOUDINARY_SECRET
2. Create account on https://www.mapbox.com/
    a. Get mapbox token and store in env variable MAPBOX_TOKEN

#### Building
1. `git clone https://github.com/sgawas/yelp-campgrounds.git`
2. `cd yelp-campgrounds`
3. `npm install`

##### Start
1. `npm start`

### heroku commands
1. heroku -v
2. heroku login or heroku login -i
3. heroku create
4. git remote add heroku <heroku git link>
5. git push heroku master
6. heroku open