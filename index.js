const express = require('express');
const mongoose = require('mongoose');
const app = express();
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const cors = require('cors');
const session = require('express-session');


var cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
var MemoryStore =session.MemoryStore;

mongoose.connect('mongodb://localhost:27017/fakebookDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors({
    origin: 'http://localhost:3000',  // Zmień na adres URL twojego klienta
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Ta opcja pozwala na przesyłanie plików cookie
}));

app.use(session({
    name : 'app.sid',
    secret: "1234567890QWERTY",
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
}));

app.use('/', postRoutes);
app.use('/', userRoutes);
app.use('/', groupRoutes);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
app.listen(3030, () => console.log('Server running on port 3030'));
