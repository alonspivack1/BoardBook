import React, {useEffect,useState,useRef, useContext} from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getRoomRoute,updateGameRoute,getUserByTokenRoute,host} from "../utils/APIRoutes";
import { SocketContext } from '../services/socket';

export default function Game() {
    const enemy = useRef();
    const moveTurnTo = useRef()
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const { roomId } = useParams();
    const player = useRef(false);
    const yourTurn = useRef(false);
    const [roomData,setRoomData] = useState(undefined)
    const [currentUser,setCurrentUser] = useState(undefined)
    const [response,setResponse] = useState(undefined)


 
    useEffect(() => {

      if(currentUser)
      {
        socket.emit("add-user",currentUser._id)
      }
   
    },[currentUser,socket]);  
    

    useEffect(()=>{
      if(socket&&roomData)
      {   
        //! move the socket.on to one time useEffect?
        socket.off("get-board");
        socket.on("get-board",(board)=>
        {
          let temproom = {...roomData}
          temproom.score = board
          temproom.turn = !roomData.turn
          setRoomData(temproom)
        })}}) 


    useEffect(() => {
      async function getGameRoom(roomId) {
        try {
          if (!localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)) {
            navigate("/login");
          } else {
            const token =await localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)
            const data = await axios.get(`${getUserByTokenRoute}/${token}`);   
            if(!data)
            {
              localStorage.clear();
              navigate("/login");
            }
            else
            {
              setCurrentUser(data.data[0]);
              setResponse( await axios.get(`${getRoomRoute}/${roomId}`))
            }           
          }
        } catch (error) {
          console.error(error);
        }
      }
      getGameRoom(roomId);
    }, []);
    useEffect(()=>
    {
      if(response)
      {
        setRoomData(response.data.room)
      }    
    },[response])
    useEffect(()=>{
      if (currentUser&&response&&roomData) {

        if(currentUser._id === roomData.users[0])
        {
          player.current=true
          moveTurnTo.current = false
          enemy.current=roomData.users[1]
          if (roomData.turn===true)
          {
            yourTurn.current=true
          }
          else
          {
            yourTurn.current=false
          }
        }
        else if (roomData.users[1] === currentUser._id)
        {
          player.current=true
          moveTurnTo.current = true
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

        console.log("Yourturn", yourTurn.current)
   
      } 
    },[roomData])

 

      const ClickHandler = async ()=>{
         if(player.current===true&&yourTurn.current===true)
         {
          await axios.post(updateGameRoute, {
            roomId: roomId,
            score: 1,
            turn:moveTurnTo.current
          }
          ).then((ex)=>{
            if(ex.data.updateSuccessful)
              {UpdateBoard()}
           })
         }
      }

        const UpdateBoard = ()=>{
          socket.emit("set-board",{
          to:enemy.current,
          board:roomData.score+1
        })  
      }

      return (
        <>
          <h1>Game {roomId}</h1> 

        {
          roomData?<button onClick={ClickHandler}>CLickMe {roomData.score}</button>:""
        }
        </>
 
        
      )
}

