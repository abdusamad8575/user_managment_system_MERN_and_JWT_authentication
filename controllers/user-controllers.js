const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY ="MyKey"

const singup = async(req,res,next)=>{
    const {name,email,password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email:email});
    } catch (error) {
        console.log(error);
    }
    if(existingUser){
        return res.status(400).json({message:'this user already exist'})
    }
    const hashedPassword = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password:hashedPassword
    });
    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }

    return res.status(201).json({message:user})
}
const login = async(req,res,next)=>{
    const {email,password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email:email});
    } catch (error) {
        return new Error(error);
    }
    if(!existingUser){
        return res.status(400).json({massege:"user not found. Singup please"})
    }
    const isPasswordCorrect = bcrypt.compareSync( password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({massege:"Invalid Email / Password"})
    }
    const token =jwt.sign({id:existingUser._id},JWT_SECRET_KEY,{expiresIn:"30s"})
    // console.log("token="+token);

    res.cookie(String(existingUser._id),token,{
        path:"/",
        expires: new Date(Date.now()+1000*30),
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(200).json({massege:"Sussusfully Logged In ",user:existingUser,token})
}

const verifyToken =(req,res,next)=>{
    const cookies =req.headers.cookie;
    const token = cookies.split("=")[1];
    // console.log(cookies);
    // console.log(token);
    if(!token){
        res.status(404).json({massege:"no token fount"})
    }
    jwt.verify(String(token),JWT_SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(400).json({massege:" Invalid Token"})
        }
        // console.log(user);
        req.id = user.id;
    })
    next();
}
const getUser = async(req,res,next)=>{
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId,"-password");
    } catch (error) {
        return new Error(err)
    }
    // console.log(user);
    if(!user){
        return res.status(404).json({massege:"user not found"})
    }
    return res.status(200).json({user})
}



exports.singup = singup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;