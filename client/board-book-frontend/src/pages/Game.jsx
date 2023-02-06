import React, {useEffect,useState,useRef} from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getRoomRoute,updateGameRoute,host} from "../utils/APIRoutes";
import {io} from "socket.io-client"

export default function Game() {
    const enemy = useRef();
    const turn = useRef();
    const socket = useRef()
    const navigate = useNavigate();
    const { roomId } = useParams();
    const player = useRef(false);
    const yourTurn = useRef(false);
    const [roomData,setRoomData] = useState(undefined)
    const [currentUser,setCurrentUser] = useState(undefined)
    const [response,setResponse] = useState(undefined)
    const [stop,setStop] = useState(undefined)


 
    useEffect(() => {

      if(currentUser)
      {
        socket.current = io(host);
        console.log("Socket1",socket.current)
        socket.current.emit("add-user",currentUser._id)
  
        return () => {
          socket.current.close()
        };
      }
   
    },[currentUser]);
    

    useEffect(()=>{
      if(socket.current)
      {   
        console.log("Socket2",socket.current)   
        socket.current.on("get-board",(board)=>
        {
          let temproom = {...roomData}
          temproom.score = board
          setRoomData(temproom)
          console.log("GET IN!")
        })}}) 

        const UpdateBoard = ()=>{
          setStop(!stop)
          console.log("Socket3",socket.current)
          socket.current.emit("set-board",{
          to:enemy._id,
          board:roomData.score+1
        })  
      }

    useEffect(() => {
      async function getGameRoom(roomId) {
        try {
          if (!localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)) {
            navigate("/login");
          } else {
            setCurrentUser(JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)));
            setResponse( await axios.get(`${getRoomRoute}/${roomId}`))
          }
        } catch (error) {
          console.error(error);
        }
      }
      getGameRoom(roomId);
    }, []);

    function a ()
    {
      
        setStop(true)
        console.log("2")
        if (currentUser&&response) {
          console.log("2")
          console.log("response -> ", response.data.room);
          console.log("CU -> ", currentUser);
          console.log("RD!!!!!!! -> ", roomData);
  
          if (currentUser && roomData&&(currentUser._id === roomData.users[0] || currentUser._id === roomData.users[1])
          ) {
            player.current=true
            turn.current = !roomData.turn
            
            if (roomData.users[0] === currentUser._id)
            {
              enemy.current=roomData.users[1]
              if (roomData.turn===true)
              {
                yourTurn.current=true
              }
              else{
                yourTurn.current=false

              }

            }
            else if (roomData.users[1]=== currentUser._id)
            {
              enemy.current=roomData.users[0]
              if (roomData.turn===false)
              {
                yourTurn.current=true
              }
              else
              {
                yourTurn.current=false

              }
            }
            if (roomData.turn === currentUser._id) {
            }
            console.log("player -> ", player.current);
            console.log("your turn?  -> ", yourTurn.current);
            console.log("currectUser -> ", currentUser._id);
          }
        }    
      return("a update   ")
    }

      function e()
      {
        setRoomData(response.data.room)
        console.log("CU!=> ",currentUser)
        console.log("RES!=> ",response)
        console.log("RD=>",roomData)
      }
      const ClickHandler = async ()=>{
        // if(player.current===true&&yourTurn.current===true)
        // {
          await axios.post(updateGameRoute, {
            roomId: roomId,
            score: 1,
            turn:turn.current
          }
          ).then((ex)=>{
            if(ex.data.updateSuccessful)
              {UpdateBoard()}
           })
        // }
   
      }

 
      return (
                       //! need to change conditions to better clean code!!
        <>
        <div>
          Game {roomId}
          {currentUser!==undefined&&response!==undefined&&roomData===undefined?e():""}
          {currentUser&&response&&roomData&&!stop?a():""}
        </div>
        {
          roomData?<button onClick={ClickHandler}>CLickMe {roomData.score}</button>:""
        }
        <button onClick={UpdateBoard}>UPDATED!!!</button>
        </>
 
        
      )
}

