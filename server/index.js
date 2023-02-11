const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
const socket = require("socket.io")
const User = require("./model/userModel")

//userRoutes.js
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes")
const gameRoutes = require("./routes/gameRoutes");
const { changeStatus } = require("./controllers/usersController");


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

        const changeStatusAndEmit=(id,status)=>{

            changeStatus(id,status).then((socketArray)=>
            {
                console.log("socketArray",socketArray)
               if(socketArray!==undefined&&socketArray!==[])
               for (let i = 0; i < socketArray.length; i++) {
                  let sendUserSocket = onlineUsers[socketArray[i]]
                  console.log("EMIT TO=>",sendUserSocket)
                  socket.to(sendUserSocket).emit("contacts-updated", {
                      id:id,
                      status:status
                  })};
            }
            )
        }

        socket.on("add-user",(userId,status)=>
        {
            onlineUsers[userId] = socket.id;
            console.log(onlineUsers)
            changeStatusAndEmit(userId,status)
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
                //socket.emit("get-board",data.board) //!to spectate, but the "get-board" need changed to string of GameID
                //socket.broadcast.emit("get-board",data.board) 
                socket.emit("get-board",data.board)
                socket.to(sendUserSocket).emit("get-board",data.board)
        });
           socket.on('disconnect', function(){
            for (let key in onlineUsers) {
                if (onlineUsers[key] === socket.id) {
                changeStatusAndEmit(key,process.env.STATUS_OFFLINE)
                 console.log('user ' + key + ' disconnected');
                 delete onlineUsers[key];
                 break;
                }  
              };
          });

    }
    )