const mongoose = require("mongoose");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type: String,
        required : true,
        unique : true
    } ,
    phoneno : {
        type : Number,
        required : true,
    },
    gender : {
        type : String,
        required :  true,
        enum : ['male','female']
    },
    password  :{
        type : String,
        required : true
    },
    tokens:[{
        token : {
            type : String,
            required : true
        }
    }
    ]
})

userSchema.methods.generateAuthToken = async function(){
    try{
        const token =  await jwt.sign({_id:this._id.toString()},"gysutewurguyfuryeurtif4837465873484w3q2w#%#$23");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(error){
        console.log(error);
    }
}

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        const passwordhash = await bcrypt.hash(this.password, 5);
        this.password = passwordhash;
    }

    next();
})

const Register = new mongoose.model("usersdata",userSchema);


module.exports = Register;
