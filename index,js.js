const express = require('express');
const mongoose = require('mongoose');
const app = express();
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/fakebookDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const session = require('express-session');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use('/', postRoutes);
app.use('/', userRoutes);

app.listen(3030, () => console.log('Server running on port 3030'));

