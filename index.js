

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const _ = require('lodash');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(session({
  secret: "The key should be in environment file",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://127.0.0.1/TaskMasterDB", {useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
    email: String,
    userName: String,
    password: String,
    tasks: [
    {
      name: String,
      deadline: Date,
    },
  ],
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req,res)=>{
    res.render("home.ejs");
});

// Register page
app.get("/register", (req,res)=>{
    res.render("register.ejs");
});
// Login Page
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
// Tasks Page for specific 
app.get("/:mailid/tasks", (req, res) => {
  const mailid = req.params.mailid;
  if(req.isAuthenticated()){
  User.findOne({ email: mailid })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Sort the tasks array by deadline
      const sortedTasks = user.tasks.sort((a, b) => a.deadline - b.deadline);

      // Render the EJS template with the sorted tasks array
      res.render("tasks", {mailid:user.email ,tasks: sortedTasks });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while retrieving tasks");
    });

  }

  else{
    res.redirect("/login");
  }
});

app.get("/:mailid/addtask",(req,res)=>{
    console.log("in addtask");
    const param = req.params.mailid;
    res.render("addtask.ejs");
});

app.post('/:mailid/tasks/:id', async (req, res) => {
  const mailid = req.params.mailid;
  const taskId = req.params.id;

  try {
    await User.updateOne({ email: mailid }, { $pull: { tasks: { _id: taskId } } });
    res.redirect(`/${mailid}/tasks`);
    console.log('Task deleted successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred while deleting the task");
  }
});



app.post("/register", (req,res)=>{
    const emailed = req.body.email;
    const username = req.body.username;
    const password  = req.body.password;
    console.log(emailed);
    console.log(username);
    console.log(password);
   User.register({username: req.body.username, email: req.body.email}, req.body.password, (err,user)=>{
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res, ()=>{
        res.redirect("/"+emailed+"/tasks");
      })
    }

   })
});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
         User.findOne({ username: user.username })
            .then(function(foundUser){
              console.log(foundUser);
              res.redirect("/"+foundUser.email+"/tasks");
            })
            .catch(function(err){
              console.log(err);
            });
      });
    }
  });

});

app.get('/logout', function(req, res){
  req.logout(function(){
    res.redirect('/login');
  });
});



app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password  = req.body.password;

    User.findOne({ userName: username})
  .then((user) => {
    if (user) {
        const goemail = user.email;
        res.redirect("/"+goemail+"/tasks");
    }
  })
  .catch((err) => {
    console.error(err);
  });
});

app.post("/:mailid/addtask", (req, res) => {
  const mailid = req.params.mailid;
  const taskname = req.body.nameoftask;
  const deadline = req.body.endoftask;

  console.log(taskname);
  console.log(deadline);

  User.findOne({ email: mailid })
    .then(user => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Create a new task object
      const newTask = {
        name: taskname,
        deadline: deadline
      };

      // Add the new task object to the tasks array
      user.tasks.push(newTask);

      // Save the changes to the database
      return user.save();
    })
    .then(() => {
      res.redirect("/"+mailid+"/tasks");
      console.log('New task added to the user');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("An error occurred while adding the task");
    });
});


app.get('/:mailid/tasks/:id/edit', (req, res) => {
  const mailid = req.params.mailid;
  const taskId = req.params.id;

  User.findOne({ email: mailid })
    .then((user) => {
      const task = user.tasks.id(taskId);
      if (!task) {
        return res.status(404).send("Task not found");
      }
      res.render('edittask', { mailid: mailid, task: task });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send("An error occurred while retrieving the task");
    });
});


app.post('/:mailid/tasks/:id/edit', (req, res) => {
  const mailid = req.params.mailid;
  const taskId = req.params.id;
  const updatedName = req.body.taskname;
  const updatedDeadline = req.body.taskdeadline;

  User.findOne({ email: mailid })
    .then((user) => {
      const task = user.tasks.id(taskId);
      task.name = updatedName;
      task.deadline = updatedDeadline;
      return user.save();
    })
    .then(() => {
      res.redirect(`/${mailid}/tasks`);
      console.log('Task updated successfully');
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send("An error occurred while updating the task");
    });
});




app.listen(3000, ()=>{console.log("Server started")});
