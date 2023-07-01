const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


exports.connect = ()=> {
    mongoose.connect(process.env.LOCAL
,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log("Cannot connect to Database");
        console.log(err);
    })
}