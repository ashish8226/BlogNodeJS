const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const app = express();
const path=require('path')


const BlogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/user');
mongoose.connect("mongodb+srv://Ashish042:"+process.env.MONGO_ATLAS_PW+"@cluster0-6seuh.mongodb.net/BlogDB?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to database');
  }).catch((err) => {
    console.log('connection failed!!', err);
  });

const port = process.env.PORT || 4000;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/images",express.static(path.join("./images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");

  next();
})
app.use('/api/blogs', BlogRoutes);
app.use('/api/user',userRoutes);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app;