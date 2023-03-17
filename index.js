const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');


const app = express();
mongoose.connect("mongodb://127.0.0.1/TaskMasterDB", {useNewUrlParser: true});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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

const User = new mongoose.model("User", userSchema);
app.get("/", (req,res)=>{
    res.render("home.ejs");
});


app.get("/register", (req,res)=>{
    res.render("register.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/:mailid/tasks", (req, res) => {
  const mailid = req.params.mailid;
  User.findOne({ email: mailid })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Sort the tasks array by deadline
      const sortedTasks = user.tasks.sort((a, b) => a.deadline - b.deadline);

      // Render the EJS template with the sorted tasks array
      res.render("tasks", {mailid:mailid,tasks: sortedTasks });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while retrieving tasks");
    });
});


app.get("/:mailid/addtask",(req,res)=>{
    const urll = req.params.mailid;
    // userSchema.findOne()
    res.render("addtask");
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
    User.findOne({ userName: username})
  .then((user) => {
    if (user) {
        res.send("<script>alert('user already exist'); window.location.href = '/register';</script>");
    } else {
        console.log('User with username does not exist');
        const newuser = new User ({
            email: emailed,
            userName : username,
            password: password
        });
        newuser.save();

        res.redirect("/login");
    }
  })
  .catch((err) => {
    console.error(err);
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
