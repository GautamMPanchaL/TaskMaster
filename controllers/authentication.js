const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const cookieParser = require('cookie-parser');

// const popup = require('popups');
// const alert = require('alert');
// const notifier = require('node-notifier');

// signup handler
exports.signup = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, password } = req.body;
        // check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.render("error", { error: 400, field: "User Already Exist" });
            return res.status(400);
        }
        // password hashing 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
        }
        catch (err) {
            res.render("error", { error: 500, field: "Internal Server Error" });
            return res.status(500);
        }
        // create a new user
        let user = await User.create({
            username, email, password: hashedPassword
        });
        // popup.alert({
        //     content: 'USER CREATED SUCCESSFULLY'
        // });
        // notifier.notify("USER CREATED SUCCESSFULLY");
        // alert("user created successfully");
        // window.alert("USER CREATED SUCCESSFULLY");
        // alert("USER CREATED SUCCESSFULLY");
        const success = "success";
        res.cookie("signup", success);
        res.redirect("/login");
        return res.status(200);
        // res.json({
        //     status : 200,
        //     success: true,
        //     message: "User Created",
        //     data: user
        // });
        // .json({
        //     success: true,
        //     message: "User Created",
        //     data: user
        // })
    }
    catch (err) {
        res.render("error", { error: 500, field: "Internal Server Error" });
        return res.status(500);
    }
}


// login handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "provide all fields"
            });
        }
        // check if user exists
        let user = await User.findOne({ email });;
        //if not found
        if (!user) {
            return res.render("error", { error: 400, field: "User Does not exist Exist" });
            return res.status(400);
        }
        // creating a payload
        let payload = {
            email: user.email,
            id: user._id
        };
        // verify password and genrate token
        if (await bcrypt.compare(password, user.password)) {
            // password matched
            let token = jwt.sign(payload, "process.env.JWT_SECRET", {
                expiresIn: "2h"
            });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            let options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("TaskMaster", token, options);
            res.redirect("/user/profile");
        }
        else {
            res.render("error", { error: 403, field: "Password or Email is incorrect" });
            return res.status(403);
        }
    }
    catch (err) {
        console.log(err);
        res.render("error", { error: 500, field: "Internal Server Error" });
        return res.status(500);
    }
}
module.exports.logout = (req, res) => {
    res.clearCookie("TaskMaster").status(204).redirect("/login");
};
