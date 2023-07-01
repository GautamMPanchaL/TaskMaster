const express = require("express");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// authentication middleware
exports.isAuthentic = (req, res, next)=>{

    try{
        // extract jwt token
        const token =  req.cookies.MoneyMaster;
        if(!token){
            return res.status(401).json({
                success:false,
                message: "Token missing"
            });
        }
        
        try{
            const decoded = jwt.verify(token, "process.env.JWT_SECRET")
            
            // console.log(decoded);
            req.user = decoded;
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message: "Invalid token"
            });
        }
        next();
    }
    catch(err){
        return res.status(401).json({
                success:false,
                message: "something went wrong.."
            });
    }
}

