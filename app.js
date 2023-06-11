const express = require ('express');
const mongoose = require('mongoose')
const router = require('./routes/user-routes')
const cookieParser =  require('cookie-parser')


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api", router)

// mongoose.connect('mongodb+srv://admin:Mx56zGRkPOnJt2CM@cluster0.9sdh1a4.mongodb.net/ums').then(()=>{
mongoose.connect('mongodb://127.0.0.1:27017/ums').then(()=>{
    app.listen(5000);
    console.log("database is conected ");
}).catch((error)=>console.log(error));
