import React, { useEffect, useState } from 'react'
import { dropDice, GetBoard, Move } from './BackGammonLogic'
import { Board } from 'backgammon-board-react';

import './BackgammonBoard.css';
function BackgammonBoard({turn=false}) {
    const[board,setBoard] = useState(GetBoard())
    const[dice,setDice] = useState()
    const[canUndo,setCanUndo] = useState()
    const[canDropDice,setCanDropDice] = useState()
    const[canFinish,setCanFinish] = useState()


    useEffect(()=>{

    },[])

    const handleDropDice = ()=>{
        if (turn&&canDropDice)
        {
            setCanDropDice(false)
            setDice(dropDice(board))
        }
    }
    
    const playTurn = ()=>
    {
        
    }


const handleFinish = ()=>{
    if(canFinish)
    {
       // finishTurn()
    }
}
const undo = ()=>{
    
}



  return (
    <>
        <button onClick={()=>handleDropDice()} disabled={turn&&canDropDice}>ROLL {dice}</button>
        <button onClick={()=>undo()} disabled={canUndo}>UNDO</button> 
        <button onClick={()=>handleFinish()} disabled={canFinish}>FINISH</button> 

        {console.log(board)}

    </>


  )
}
export default BackgammonBoard

