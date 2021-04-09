const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');


router.post('/signup', (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password,10)
  .then(hash => {
    console.log(hash)
    const NewUser = user({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    console.log(NewUser);
    NewUser.save()
    .then(result => {
      res.status(201).json({
        message: 'user Created !',
        result: result
      });
      window.location = '/';
    });
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  });
});

router.post('/login', (req,res,next) => {
  let fetchedUser = {};
  user.findOne({email: req.body.email})
  .then(user1 => {
    if(!user1){
      return res.status(401).json({
        message: 'Invalid email!'
      })
    }
    fetchedUser = user1;
    return bcrypt.compare(req.body.password, fetchedUser.password);
  }).then(result => {
    if(!result){
      return res.status(401).json({
        message: 'Password does not match.'
      });
    }
    //console.log(user);
    console.log("sdgfadfg"+ fetchedUser);
    const token = jwt.sign({email: req.body.email, userId: fetchedUser._id}, 'A_very_long_string_for_our_secret_devanshi_patel',{expiresIn: '1h'});
    //console.log(jwt.verify(token,'A_very_long_string_for_our_secret_devanshi_patel'));
    res.status(200).json({
      token : token,
      expiresIn: 3600,
      customerId: fetchedUser._id,
      emailId : fetchedUser.emailId
    });
  }).catch(err => {
    return res.status(401).json({
      message: "Email or Password entered in wrong."
    });
  });
});

module.exports = router;
