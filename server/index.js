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
            credentials: true,
        },
    });

   // Change the ping interval to 30 seconds
   io.pingInterval = process.env.PING_INTERVAL;
   // Change the ping timeout to 10 seconds
   io.pingTimeout = process.env.PING_TIMEOUT;

   





    global.onlineUsers = new Map();
    global.onGameUsers = new Map();
    io.on("connection",(socket)=>{

        const changeStatusAndEmit=(id,status,returnContactsList,deleteGameID=false)=>{
            changeStatus(id,status,returnContactsList,deleteGameID).then((socketArray)=>
            {
                if(socketArray)
                {
                    if(socketArray!==undefined&&socketArray!==[])
                    for (let i = 0; i < socketArray.length; i++) {
                       let sendUserSocket = onlineUsers[socketArray[i]]
                       socket.to(sendUserSocket).emit("contact-status-updated", {
                           id:id,
                           status:status
                       })};
                }
            
            }
            )
        }
        
        socket.on("add-user",(userId,status)=>
        {
            onlineUsers[userId] = socket.id;
            console.log(onlineUsers)
            changeStatusAndEmit(userId,status,true,false)
        });
        socket.on("add-game-user",(userId,status)=>
        {
            console.log("add-game",onGameUsers[userId])
            if(onGameUsers[userId]===undefined)
            {
                onGameUsers[userId] = socket.id;
                changeStatusAndEmit(userId,status,true,false)
            }
            else{
                console.log("1")
                socket.emit("double-entry")
            }
        
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
               console.log(data.roomId)
                socket.emit(`${data.roomId}`,data.board)
                socket.broadcast.emit(`${data.roomId}`,data.board)
        });
        socket.on("add-contact",(data)=>
        {
            const sendUserSocket = onlineUsers[data.to]
            socket.to(sendUserSocket).emit("add-contact",data.contact)
        });
        socket.on("delete-contact",(data)=>
        {
            const sendUserSocket = onlineUsers[data.to]
            socket.to(sendUserSocket).emit("delete-contact",data.contact)
        });
        socket.on("game-offer",(data)=>
        {
            const sendUserSocket = onlineUsers[data.to]
            socket.to(sendUserSocket).emit("game-offer",{
                from:data.from,
                roomId:data.roomId
            })

        })
      
           socket.on('disconnect', function(){
            console.log("1")
            let id
            for (let key in onlineUsers) {
                if(onlineUsers[key]===socket.id)
                {
                    id=key
                    if(onGameUsers[id]===undefined)
                    {
                        changeStatusAndEmit(id,process.env.STATUS_OFFLINE,true,false)
                        console.log('user ' + id + ' disconnected');
                        delete onlineUsers[id];
                        break;
                    }
                    else
                    {
                        delete onlineUsers[id];
                        break;
                    }
                }
            }
            if(!id)
            {
               

                for (let key in onGameUsers) {

                    if(onGameUsers[key]===socket.id)
                    {
                        id=key
                        if(onlineUsers[id]===undefined)
                        {
                            changeStatusAndEmit(id,process.env.STATUS_OFFLINE,true,true)
                            console.log('user ' + id + ' disconnected');
                            delete onGameUsers[id];
                            break;
                        }
                        else
                        {
                            console.log("2")
                            changeStatusAndEmit(id,process.env.STATUS_ONLINE,true,true)
                            delete onGameUsers[id];
                            break;
                        }
                    }
                }
            }
            
            
          });

    }
    )