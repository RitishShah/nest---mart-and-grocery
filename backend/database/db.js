const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path:"backend/config/.env"
})

const mongoURL = process.env.DB_URL;

const connectDatabase = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology:true
    }).then(connect => {
        console.log("database connected");
    })
}

module.exports = connectDatabase;