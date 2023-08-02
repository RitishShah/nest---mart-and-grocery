const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./database/db');
const cloudinary = require('cloudinary');

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Shutting Down Server for Handling Uncaught Exception : ${err.message}`);
});

dotenv.config({
    path:"backend/config/.env"
})

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';

const server = http.createServer(app);

// Connect to Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

server.listen(PORT, HOST,()=>{console.log(`Server IS runnnig on ${PORT}`);})

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting Down Server for the ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});