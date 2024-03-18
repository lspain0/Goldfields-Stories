require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const storyRoutes = require('./routes/stories');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express();

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use('/api/stories', storyRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/images', homeRoutes);

/**
 * New Route added for user routes
 */
app.use('/api/users', userRoutes)


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
