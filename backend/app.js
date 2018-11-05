const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

let appRoutes = require('./routes/app');
let userRoutes = require('./routes/user');
let forumRoutes = require('./routes/forum');
let findLocalsRoutes = require('./routes/findLocals');
let cors = require('cors');



const app = express();

mongoose
  .connect(
    "mongodb://tijldc:kick1234@ds119110.mlab.com:19110/harry-potter-ar"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use(cors());

app.use('/', appRoutes);
app.use('/user', userRoutes);
app.use('/forum', forumRoutes);
app.use('/findLocals', findLocalsRoutes);


module.exports = app;
