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
  console.log("in insert new");
  // let {name,category,deadline} = req.body;
  let name = req.body.nameoftask;
  let category = req.body.category;
  let deadline = req.body.endoftask;
  // console.log(name + category + deadline);
  if(category === "Other")
    category = req.body.additional;
  const trimed = category.trim();
  // const trimed = "shashwat";
  console.log(trimed);
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", {error:400, field:"User Not Found"});
            return res.status(400);
    }
    // Add the transaction to the user's transactions array
    user.upcomingtasks.unshift({deadline, name, category});
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
    console.log(user.upcomingtasks.length);
    console.log(user.completedTasks.length);
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
    console.log("In Dashboard");
    let latx = [],upx = [],latnx = [],upnx = [];
    let st12,st22;
    const now = new Date().getTime();
    for(let i = 0;i<user.upcomingtasks.length;i++){
        if(new Date(user.upcomingtasks[i].deadline)-now<0){
            st12 = user.upcomingtasks[i].deadline;
            st12 = st12.toString();
            // console.log(st12);
            latx.push(user.upcomingtasks[i]);
            latnx.push({first : st12.substr(0,15),second : st12.substr(16,8)});
        }
        else{
            st22 = user.upcomingtasks[i].deadline;
            st22 = st22.toString();
            // st22 = task && task.deadline ? task.deadline.toString() : "";
            // console.log(st22);
            upx.push(user.upcomingtasks[i]);
            upnx.push({first : st22.substr(0,15),second : st22.substr(16,8)});
        }
    }

  res.render('dashboard', { puser: x, upx : upx , latx : latx,upnx : upnx,latnx : latnx});
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
  const token = req.cookies.TaskMaster;
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
  const taskId = req.body.taskId;
  const { updatedName, updatedDeadline} = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }

    const taskToUpdate = user.upcomingtasks.id(taskId);
    if (!taskToUpdate) {
      res.render("error", { error: 404, field: "Task not found" });
      return res.status(404);
    }

    // Update the task content
    taskToUpdate.name = updatedName;
    taskToUpdate.deadline = updatedDeadline;

    // Save the updated user document
    await user.save();
    let x = JSON.stringify(user);
    console.log(x);
    console.log("after update");
    res.redirect('/dashboard');
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



exports.updateTaskpage = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.body.taskId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }

    const taskToUpdate = user.upcomingtasks.find(task => task._id.toString() === taskId);
    if (!taskToUpdate) {
      res.render("error", { error: 404, field: "Task not found" });
      return res.status(404);
    }

    let x = JSON.stringify(user);
    console.log(x);
    console.log("User Edit");
    res.render('edittask', {
      taskId: taskId,
      name: taskToUpdate.name,
      category: taskToUpdate.category,
      deadline: taskToUpdate.deadline,
      puser: x
    });
    return res.status(200);
  } catch (error) {
    console.error(error);
    res.render("error", {
      error: 500,
      field: "Internal Server Error, failed to update the task......."
    });
    return res.status(500);
  }
};



exports.deleteTask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.body.taskId;
  console.log(taskId);
   try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }

    const taskToDeleteIndex = user.upcomingtasks.findIndex(task => task._id.toString() === taskId);
    if (taskToDeleteIndex === -1) {
      res.render("error", { error: 404, field: "Task not found" });
      return res.status(404);
    }

    const taskToDelete = user.upcomingtasks[taskToDeleteIndex];
    user.upcomingtasks.pull(taskToDelete._id);
    await user.save();

    let x = JSON.stringify(user);
    console.log(x);
    console.log("Complete Task");

    res.redirect("/dashboard");
    return res.status(200);
  } catch (error) {
    console.error(error);
    res.render("error", {
      error: 500,
      field: "Internal Server Error, failed to complete the task"
    });
    return res.status(500);
  }
};






exports.completeTask = async (req, res) => {
  console.log(req.body);
  const userId = req.user.id;
  const taskId = req.body.taskId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }

    const taskToDeleteIndex = user.upcomingtasks.findIndex(task => task._id.toString() === taskId);
    if (taskToDeleteIndex === -1) {
      res.render("error", { error: 404, field: "Task not found" });
      return res.status(404);
    }

    const taskToDelete = user.upcomingtasks[taskToDeleteIndex];
    user.upcomingtasks.pull(taskToDelete._id);

    const nowDate = new Date();
    const completedTask = {
      name: taskToDelete.name,
      category: taskToDelete.category,
      deadline: taskToDelete.deadline,
      dateCompleted: nowDate
    };
    user.completedTasks.push(completedTask);

    await user.save();

    let x = JSON.stringify(user);
    console.log(x);
    console.log("Complete Task");

    res.redirect("/dashboard");
    return res.status(200);
  } catch (error) {
    console.error(error);
    res.render("error", {
      error: 500,
      field: "Internal Server Error, failed to complete the task"
    });
    return res.status(500);
  }
};



exports.completePage = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.render("error", { error: 404, field: "User not found" });
      return res.status(404);
    }
    let x = JSON.stringify(user);
    console.log(x);
    let completex = user.completedTasks;
    completex = completex.sort(function (x,y){
          return new Date(y.date)-new Date(x.date);
        });
    let compx = [],dx = [];
    let str;
    for(let i = 0;i<completex.length;i++){
      str = completex[i].deadline.toString();
      dx.push({date : str.substr(0,15),time : str.substr(16,8)});
      console.log("Date : ");
      console.log(str);
      str = completex[i].dateCompleted.toString();
      console.log("Date : ");
      console.log(str);
      compx.push({date : str.substr(0,15),time : str.substr(16,8)});
    }
    console.log("Complete Page");
    res.render("completetask", {puser : x , completex : completex ,compx : compx,dx : dx,compxs : JSON.stringify(compx),dxs : JSON.stringify(dx)});
    return res.status(200);
  } 
  catch (error) {
    console.error(error);
    res.render("error", {
      error: 500,
      field: "Internal Server Error, failed to complete the task"
    });
    return res.status(500);
  }
};
