const express = require('express');
const mongoose = require('mongoose');
const depositRoutes = require('./routes/deposits');
const userRoutes = require('./routes/users');
const cron = require('node-cron');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://devanshi:vd9GaxYPnSjFvya6@cluster0.8jifm.mongodb.net/angularDB?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Connected to Database");
})
.catch((error) => {
  console.log("Connection Failed: "+ error);
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
})

app.use(express.static(process.cwd() + "/dist/FDTracker"))

app.use('/api/deposits',depositRoutes);
app.use('/api/user',userRoutes);
console.log(__dirname);

app.get('*', (req,res) => {
  const pathFile = path.join(__dirname,"../dist" ,"FDTracker");
  res.sendFile(pathFile + "/index.html");
});

cron.schedule('0 0 18 * * SUN,WED', () => {
  console.log('hello');
  require('./emailingUsers/email.js');
})

module.exports = app;
