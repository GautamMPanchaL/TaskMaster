const express = require("express");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// authentication middleware
exports.isAuthentic = (req, res, next)=>{

    try{
        // extract jwt token
        const token =  req.cookies.TaskMaster;
        // console.log(req.cookies.TaskMaster);
        if(!token){
            res.render("error", {error:401, field:"Token missing"});
            return res.status(401);
        }
        
        try{
            const decoded = jwt.verify(token, "process.env.JWT_SECRET")

            // console.log(decoded);
            req.user = decoded;
        }
        catch(err){
            res.render("error", {error:401, field:"Invalid token"});
            return res.status(401);
        }
        next();
    }
    catch(err){
        res.render("error", {error:401, field:"something went wrong.."});
            return res.status(401);
    }
}

