const mongoose = require('mongoose');


const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(()=>console.log('MONGO DB connection successful'))
.catch(()=>{console.log('Error!!!')})