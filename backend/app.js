const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require("path");

app.use(cookieParser());
// app.use(bodyParser.json({ limit: "50mb" }))
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit : '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(fileUpload());

// Import Routes
const user = require('./routes/userRoutes');
const product = require('./routes/productRoutes');
const order = require('./routes/orderRoutes');
const payment = require('./routes/paymentRoutes');
const cart = require('./routes/cartRoutes');
const favourite = require('./routes/favouriteRoutes');
const report = require('./utils/report');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-allow-Headers", "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', "PUT, PATCH, GET, POST, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use('/api/v2', user);
app.use('/api/v2', product);
app.use('/api/v2', order);
app.use('/api/v2', payment);
app.use('/api/v2', cart);
app.use('/api/v2', favourite);
app.use('/api/v2', report);

// So, this allows us to use frontend in our backend server.
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});


module.exports = app;