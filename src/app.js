const express = require("express");
const app = express();
require("./db/conn");
const path = require("path");
const hbs = require("hbs");
const Register = require("./models/registers");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const auth = require("./middleware/auth")

const port = process.env.port || 3000;
const static_path = path.join(__dirname,"..","public");
const views_path = path.join(__dirname,"..","templates","views");
const partial_path = path.join(__dirname,"..","templates","partials");
hbs.registerPartials(partial_path);

app.use(cookieparser());
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set("view engine","hbs");
app.set("views",views_path)


const checkPassword = async(password,passwordhash)=>{
    const passwordmatch = await bcrypt.compare(password,passwordhash);
    return passwordmatch;
}

app.get("/",auth,(req,res)=>{
    const token = req.cookies.jwt;
 
    res.render("index",{token : token});
})


app.get("/register",(req,res)=>{
    res.render("register");
})


app.post("/register",async (req,res)=>{
    try{
        const password = req.body.password;
        const registeruser = new Register({
            name : req.body.name,
            email : req.body.email,
            phoneno : req.body.phoneno,
            gender : req.body.gender,
            password  : password
        });

        const token  = await registeruser.generateAuthToken();
        const registered =  await registeruser.save();
        // res.status(201).send(registered);
        console.log(token);
        console.log(registered);
        res.status(201).render("index");
    }
    catch(error){
        res.status(400).send(error);
    }
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",async (req,res)=>{
    try{
        const emailid = req.body.email;
        const password = req.body.password;

        user = await Register.findOne({email : emailid});
        const match = await checkPassword(password,user.password);
        const token  = await user.generateAuthToken();
        // console.log(match);
        if(match){
            res.cookie("jwt",token);
            res.status(200).render("index");
        }else{
            res.send("invalid login details");
        }
    }
    catch(error){
        res.status(400).send(error);
    }
})

app.get("/logout",auth, async(req,res)=>{
    try {
        // console.log(req.user);
        
        // For Only 1 device logout
        // req.user.tokens = req.user.tokens.filter((elem,inde,array)=>{
        //     return elem.token != req.token;
        // });
        req.user.tokens = [];
        res.clearCookie("jwt");


        console.log("Logged Out Suceessfully");
        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})