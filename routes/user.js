const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

const {login , signup ,logout} = require("../controllers/authentication");
const { insertnew, profile, dashboard, addnewTask, updateTaskpage, updateTask, deleteTask, completeTask ,completePage } = require("../controllers/userController");
const {isAuthentic} = require("../middlewares/auth");

router.get("/",(req,res)=>{
    res.render('home.ejs');
});

router.get("/login",(req,res)=>{
    // console.log(req.cookies);
    const str = req.cookies.signup;
    res.clearCookie("signup");
    console.log(str);
    res.render('login',{opt : str});
});

router.post("/login", login);

router.get("/signup",(req,res)=>{
    res.render('signup');
});

router.post("/signup",signup);

router.post("/logout", logout);


// profile page route
router.get("/user/profile",isAuthentic, profile);

// dashboard to see the transcations
router.get("/dashboard", isAuthentic, dashboard);

// to insert new transcation 

router.get("/dashboard/insertnew",isAuthentic, addnewTask);

router.post("/dashboard/insertnew",isAuthentic, insertnew);

// to view updated task pages

router.post("/dashboard/updatetask", isAuthentic, updateTaskpage);

router.post("/dashboard/updatetasks", isAuthentic, updateTask);
// delete task from the upcoming tasks
router.post("/dashboard/delete", isAuthentic, deleteTask);
// complete Task 
router.post("/dashboard/completed", isAuthentic, completeTask);

router.get("/dashboard/completePage",isAuthentic, completePage);

module.exports = router;