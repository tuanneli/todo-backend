const mongoose = require('mongoose');
const express = require('express');
const expressFileupload = require('express-fileupload');
require('dotenv').config();
const router = require('./src/router/router');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(expressFileupload({}));
// app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use('/api', router);

app.use(errorMiddleware);

/**
 * Функция запуска сервера
 */

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();