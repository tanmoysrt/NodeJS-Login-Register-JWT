const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/project_login",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
.then(()=>{
    console.log("Connection Successful");
})
.catch((e)=>{
    console.log("Connection Failed");
})