import React, {useEffect,useState,useRef, useContext} from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getRoomRoute,updateGameRoute,getUserByTokenRoute} from "../utils/APIRoutes";
import { SocketContext } from '../services/socket';
import BackgammonBoard from '../components/Backgammon/BackgammonBoard';

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
    const [board,setBoard] = useState()
    const [dice,setDice] = useState()
    const[undo,setUndo] = useState()
    const[canDropDice,setCanDropDice] = useState(true)
    const[canFinish,setCanFinish] = useState()
 
    
    useEffect(() => {
      if(currentUser)
      {
        socket.emit("add-game-user",currentUser._id,process.env.REACT_APP_STATUS_INGAME,roomId)
      }
      
    },[socket,currentUser]);

    useEffect(()=>{
      if(socket&&roomData&&roomId)
      {   
          socket.off(`${roomId}`)
          socket.on(`${roomId}`,(data)=>
        {
          let temproom = {...roomData}
          temproom.board = data.board
          temproom.turn = data.turn


          temproom.dice = data.dice
          temproom.undo = data.undo
          temproom.canDropDice = data.canDropDice
          temproom.canFinish = data.canFinish
          setRoomData(temproom)
        })
    }},[roomData,socket,roomId]) 


    useEffect(() => {
      async function getGameRoom(roomId) {
        try {
          if (!localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)) {
            navigate("/login");
          } else {
            const token = localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)
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
        setBoard(roomData.board)
        setDice(roomData.dice)
        setUndo(roomData.undo)
        setCanDropDice(roomData.canDropDice)       
        setCanFinish(roomData.canFinish)
        
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

    const handleFinishTurn= async (board)=>{
      dice[0].used=true;
      dice[1].used=true;
      dice[2].used=true;
      dice[3].used=true;

      if(player.current===true&&yourTurn.current===true)
      {
       await axios.post(updateGameRoute, {
         roomId: roomId,
         board: board,
         turn:moveTurnTo.current,
         dice:dice,
         undo:[],
         canDropDice:true,
         canFinish:false,
       }
       ).then((ex)=>{
         if(ex.data.updateSuccessful)
         {UpdateBoard(board,(moveTurnTo.current),dice,[],true,false)}
        })
      }
   }

      const handleUpdateBoard= async (board,dice,undo,canDropDice,canFinish)=>{
         if(player.current===true&&yourTurn.current===true)
         {
          await axios.post(updateGameRoute, {
            roomId: roomId,
            board: board,
            dice:dice,
            undo:undo,
            canDropDice:canDropDice,
            canFinish:canFinish,
          }
          ).then((ex)=>{
            if(ex.data.updateSuccessful)
              {UpdateBoard(board,!moveTurnTo.current,dice,undo,canDropDice,canFinish)}
           })
         }
      }

        const UpdateBoard = (board,turn,dice,undo,canDropDice,canFinish)=>{
          socket.emit("set-board",{
            roomId: roomId,
            board: board,
            turn:turn,
            dice:dice,
            undo:undo,
            canDropDice:canDropDice,
            canFinish:canFinish,

        })  
      }



      return (
        <>
          <h1>Game {roomId}</h1> 
        {
         <>
{            board?(<BackgammonBoard undo={undo} setUndo={setUndo} canDropDice={canDropDice} setCanDropDice={setCanDropDice} setCanFinish={setCanFinish} canFinish={canFinish} dice ={dice} setDice={setDice} handleFinishTurn = {handleFinishTurn} handleUpdateBoard={handleUpdateBoard} board={board} setBoard={setBoard} turn ={yourTurn.current} player={moveTurnTo.current===false?0:1}/>):"Loading..."
}         
         </>
        }
        </>
 
        
      )
      
}

