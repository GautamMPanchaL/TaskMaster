const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require:true,
        trim:true,
    },

    email: {
        type: String,
        require:true,
        trim:true,
    },
    password: {
        type: String,
        require:true,
        trim:true
    },

    upcomingtasks: [{
        deadline: Date,
        name: String,
        category: String,
    }],

  completedTasks: [{
    name: String,
    category: String,
    deadline: Date
  }]
});

module.exports = mongoose.model("User", userSchema);