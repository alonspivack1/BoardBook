const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")

//userRoutes.js
const userRoutes = require("./routes/userRoutes")

const app = express();
require("dotenv").config();

// * cors -> cross origin resource sharing
app.use(cors());
app.use(express.json());

// ! what is /api/auth?
app.use("/api/auth",userRoutes)


//#region MongoDB
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB Connection Successfully");
}).catch((error)=>{
    console.log(error.message);
});
//#endregion MongoDB
//* listen to the PORT
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`)
})
