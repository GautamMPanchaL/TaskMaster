require("dotenv").config();
const express = require("express");
const port = process.env.PORT || "3000";
// const PORT = 3000;
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(cookieParser());


app.use(express.json());

require("./config/database").connect();

// route
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

const user = require("./routes/user");

app.use("/", user);


// server

app.listen(3000, ()=>{
    console.log(`Server started at ${port}`);
    console.log(`http://localhost:${port}/`);
})
