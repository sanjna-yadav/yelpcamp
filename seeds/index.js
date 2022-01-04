const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const session = require('express-session');


const MongoDBStore = require("connect-mongo")(session);

const dbUrl = 'mongodb+srv://xyz:anmBCQ2SUr3W15rw@cluster0.niwfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '61d4996386f05824d08895f4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                // {
                //     url: 'https://res.cloudinary.com/dnmetviez/image/upload/v1641117292/YelpCamp/jose-ignacio-pompe-kLGnN8AlEZc-unsplash_ke3is1.jpg',
                //     filename: 'YelpCamp/jose-ignacio-pompe-kLGnN8AlEZc-unsplash_ke3is1'
                // },
                {
                    url: 'https://res.cloudinary.com/dyhoxylvh/image/upload/v1641325911/YelpCamp/hkswcbwfu45s4ku3zn4l.jpg',
                    filename: 'YelpCamp/hkswcbwfu45s4ku3zn4l'
                },
                {
                    url: 'https://res.cloudinary.com/dyhoxylvh/image/upload/v1641325230/YelpCamp/fagnumugme5tqvpefxdw.jpg',
                    filename: 'YelpCamp/fagnumugme5tqvpefxdw'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})