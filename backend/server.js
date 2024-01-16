require('dotenv').config()

const result = require('dotenv').config();

if (result.error) {
  console.error(result.error);
  process.exit(1);
}


//require express
const express = require('express')
const mongoose = require('mongoose')
const storyRoutes = require('./routes/stories')
const classRoutes = require('./routes/classRoutes');

//express app
const app = express()

//middleware app
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/stories', storyRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
        console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
// Use class routes
app.use('/api/classes', classRoutes);



