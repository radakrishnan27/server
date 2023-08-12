const express = require('express');
const login = express.Router();
const jwt = require('jsonwebtoken');


login.use(express.json());
login.use(express.urlencoded({extended:true}));

const loginData = require('../model/account');


// login

login.post('/login', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const user = await loginData.findOne({
        email: email
      });
  
      if (!user) {
        res.status(500).json({ message: 'User not found, Please register' });
      } else {
        if (user.password === password) {

          jwt.sign({
            email:email,
            id:user._id
          },
          "ictak",
          {expiresIn:'1d'},
          (error,token)=>{
            if (error) {
              res.json({message:'Token not generated'})
            } else {
              res.json({
                message:'Login successful',
                token:token,
                data:user
              })}})
        } else {
          res.status(500).json({ message: 'Incorrect password' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
// email verification

  login.post('/emailVerification', async (req, res) => {
    try {
      const email = req.body.email;
      const emailCheck = await loginData.findOne({ email: email });
  
      if (emailCheck) {
        // Email found in the database
        res.status(200).json({ message: 'email found' });
      } else {
        // Email not found in the database
        res.status(404).json({ message: 'email not found in the database' });
      }
    } catch (error) {
      res.status(500).json({ error: 'error' });
    }
  });
  
// Signup

login.post('/signup', async(req,res)=>{
  let input = req.body;
  const email = req.body.email;
  const emailCheck = await loginData.findOne({ email: email });
  if (!emailCheck) {
    try {
      const newUser = new loginData(input);
      newUser.save();
      res.status(200).json({message:'Registered Successfully!!!'});
  } catch (error) {
      console.error(error);
      res.status(500).json({error:'Unable to register'});
  }
  } else {
    res.status(200).json({ message: 'Email already registered, try a different email' });
  }

})



// Error handling middleware
login.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = login;