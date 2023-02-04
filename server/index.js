const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
const socket = require("socket.io")

//userRoutes.js
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes")


const app = express();
require("dotenv").config();

// * cors -> cross origin resource sharing
app.use(cors());
app.use(express.json());

// ! what is /api/auth?
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)



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
});
const io = socket(server,
    {
        cors:{
            origin:"http://localhost:3000",
            credentials: true,
        },
    });
    global.onlineUsers = new Map();
    io.on("connection",(socket)=>{

        socket.on("add-user",(userId)=>
        {
            onlineUsers[userId] = socket.id;
            console.log(onlineUsers)
        });
        socket.on("send-msg",(data)=>
        {
            const sendUserSocket = onlineUsers[data.to]
            if(sendUserSocket)
            {
                socket.to(sendUserSocket).emit("msg-receive",data)
            }
            else
            {console.log("Message sended to unconnected user")  }
        });
        socket.on('disconnect', function(){
            console.log('user ' + socket.id + ' disconnected');
            Object.keys(onlineUsers).forEach(key => {
                if (onlineUsers[key] === socket.id) {
                  delete onlineUsers[key];
                }
              });
              console.log(onlineUsers)
              
          });

    })