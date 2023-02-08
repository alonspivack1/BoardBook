const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
const socket = require("socket.io")

//userRoutes.js
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes")
const gameRoutes = require("./routes/gameRoutes")


const app = express();
require("dotenv").config();

// * cors -> cross origin resource sharing
app.use(cors());
app.use(express.json());

// ! what is /api/auth?
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/game",gameRoutes)



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

   // Change the ping interval to 30 seconds
   io.pingInterval = process.env.PING_INTERVAL;
   // Change the ping timeout to 10 seconds
   io.pingTimeout = process.env.PING_TIMEOUT;

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
            else  {console.log("Message sended to unconnected user")  }
        });
        socket.on("set-board",(data)=>
        {
                const sendUserSocket = onlineUsers[data.to]
                //socket.emit("get-board",data.board)
                //socket.broadcast.emit("get-board",data.board)
                socket.emit("get-board",data.board)
                socket.to(sendUserSocket).emit("get-board",data.board)
        });
           socket.on('disconnect', function(){
            Object.keys(onlineUsers).forEach(key => {
                if (onlineUsers[key] === socket.id) {
                 console.log('user ' + key + ' disconnected');
                  delete onlineUsers[key];
                }
              });
          });

    })