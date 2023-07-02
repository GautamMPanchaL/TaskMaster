const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cookieParser = require('cookie-parser');



exports.insertnew = async (req, res) => {
  const token = req.cookies.TaskMaster;
  const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");
  const userId = decodedToken.id;
  console.log(req.body);
  let {name , category, deadline, additional} = req.body;
  if(category === "Other")
    category = additional;
  const trimed = category.trim();
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", {error:400, field:"User Not Found"});
            return res.status(400);
    }
    // Add the transaction to the user's transactions array
    user.upcomingtasks.unshift({deadline, name, trimed});
    // update the money

    const updatedUser = await user.save();

    let x = JSON.stringify(user);
    console.log(x);
    res.redirect("/dashboard");
    return res.status(200);
  } 
  catch (error) {
    console.error(error);
        res.render("error", {error:500, field:"Fail to insert data"});
        return res.status(500);
  }
};



exports.profile = async (req, res) => {
  console.log("profile");
  console.log(req.body);
  const token = req.cookies.TaskMaster;
  const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");
  const userId = decodedToken.id;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", {error:400, field:"User Not Found"});
            return res.status(400);
    }

    console.log("in profile");
    console.log(user);

    let x = JSON.stringify(user);
    console.log(x);

    res.render('profile',{puser : x});
    return res.status(200);
  } 
  catch (error) {
    console.error(error);
    res.render("error", {error:500, field:"Internal Server Error, failed to fetch data"});
            return res.status(500);
  }
};



exports.dashboard = async (req, res) => {

  const userId = req.user.id;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", {error:404, field:"User not found"});
            return res.status(404);
    }

   //new logic for the tasks upcomig and completed tasks;
   let x = JSON.stringify(user);
    console.log(x);
  res.render('dashboard', { puser: x});
    return res.status(200);
  } 
  catch (error){
    console.error(error);
    res.render("error", {error:500, field:"Internal Server Error, fail to fetch data"});
            return res.status(500);
  }

};



exports.addnewTask = async (req, res) => {

  console.log("on add task page");
  console.log(req.body);
  const token = req.cookies.MoneyMaster;
  const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");
  const userId = decodedToken.id;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", {error:404, field:"User not found"});
            return res.status(404);
    }
    console.log("on add task page");
    console.log(user);

    let x = JSON.stringify(user);
    console.log(x);
   
    res.render('addtask',{puser : x});
    return res.status(200);
  }
  catch(error){
    console.error(error);
    res.render("error", {error:500, field:"Internal Server Error, fail to fetch data"});
            return res.status(500);
  }
}

// handle post request for the update task page ;
exports.updateTask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;
  const { updatedName, updatedCategory, updatedDeadline } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }

    const taskToUpdate = user.upcomingTasks.id(taskId);

    // Find the task by its ID in the upcomingTasks array
    if (!taskToUpdate) {
      res.render("error", { error: 404, field: "Task not found" });
      return res.status(404);
    }

    // Update the task content
    taskToUpdate.name = updatedName;
    taskToUpdate.category = updatedCategory;
    taskToUpdate.deadline = updatedDeadline;

    // Save the updated user document
    await user.save();

    res.render('dashboard', {});
    return res.status(200);
  } catch (error) {
    console.error(error);
    res.render("error", {
      error: 500,
      field: "Internal Server Error, failed to update the task"
    });
    return res.status(500);
  }
};

// get request for update task page;
exports.updateTaskpage = async (req, res) => {

  const userId = req.user.id; // Assuming the user ID is available in the request object
  const taskId = req.params.taskId; // Assuming the task ID is available in the request parameters
   
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }

    const taskToUpdate = user.upcomingTasks.id(taskId); // Find the task by its ID in the upcomingTasks array
    if (!taskToUpdate) {
      res.render("error", { error: 404, field: "Task not found" });
      return res.status(404);
    }

    // Update the task content0
    let x = JSON.stringify(user);
    console.log(x);
    res.render('edittask', {name : taskToUpdate.name, category: taskToUpdate.category , deadline: taskToUpdate.deadline,puser : x });
    return res.status(200);
  } catch (error) {
    console.error(error);
    res.render("error", {
      error: 500,
      field: "Internal Server Error, failed to update the task"
    });
    return res.status(500);
  }
}