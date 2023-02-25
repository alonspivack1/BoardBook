import React, { useEffect, useState } from 'react'
import { canMovePiece, dropDice, GetBoard, Move } from './BackGammonLogic'

import './BackgammonBoard.css';
import Piece from './Piece';
import MiddleBar from './MiddleBar';
import Arrow from './Arrow';
function BackgammonBoard({turn=true}) {
    const[board,setBoard] = useState(GetBoard())
    const[dice,setDice] = useState()
    const[canUndo,setCanUndo] = useState()
    const[canDropDice,setCanDropDice] = useState(true)
    const[canFinish,setCanFinish] = useState()


    useEffect(()=>{

    },[])

    const handleDropDice = ()=>{
        if (turn&&canDropDice)
        {
            setCanDropDice(false);
            let dropdice= dropDice(board,0)
            setDice(dropdice.Dice)
            setCanFinish(dropdice.BoolCanFinish)

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
        <button onClick={()=>handleDropDice()} disabled={!(turn&&canDropDice)}>ROLL</button>
        <button onClick={()=>undo()} disabled={!(canUndo)}>UNDO={canUndo}</button> 
        <button onClick={()=>handleFinish()} disabled={!(canFinish)}>FINISH={canFinish}</button> 
        {console.log(board)}
    
        <div className = "board ">
        <div className = "space"></div>
        { Array.from({ length: 6 }, (_, i) => (
        <Arrow key ={i} odd={i%2!==0} upcount={board[0].data[11-i]+board[1].data[12+i]} downcount={board[0].data[12+i]+board[1].data[11-i]} upmainplayer={board[0].data[11-i]>0} downmainplayer={board[0].data[12+i]>0} optionup ={canMovePiece(board,dice,0,11-i)} optiondown ={canMovePiece(board,dice,0,12+i)}/>
        ))}
        <MiddleBar player0count={4} player1count={4}/>
        { Array.from({ length: 6 }, (_, i) => (
        <Arrow key ={i} odd={i%2!==0} upcount={board[0].data[5-i]+board[1].data[18+i]} downcount={board[0].data[18+i]+board[1].data[5-i]} upmainplayer={board[0].data[5-i]>0} downmainplayer={board[0].data[18+i]>0}  optionup ={canMovePiece(board,dice,0,5-i)} optiondown ={canMovePiece(board,dice,0,18+i)}/>
        ))}
        </div>

 </>


  )
}
export default BackgammonBoard

