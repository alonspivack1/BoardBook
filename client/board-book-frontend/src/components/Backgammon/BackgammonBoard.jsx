import React, { useEffect, useState } from 'react'
import { allPiecesInHome, canMovePiece, canPlaceIndexes, canPlay, canReturnEatenPiece, canTakeOutSpecificPiece, dropDice, GetBoard, Move, updateDice } from './BackGammonLogic'

import './BackgammonBoard.css';
import MiddleBar from './MiddleBar';
import ArrowUp from './ArrowUp';
import ArrowDown from './ArrowDown';
import EndBar from './EndBar';

function BackgammonBoard({undo,setUndo,canDropDice,setCanDropDice,canFinish,setCanFinish,dice,setDice,handleFinishTurn,handleUpdateBoard,board,setBoard,turn,player}) {
    const[placeIndexes,setPlaceIndexes] = useState([])
    const[heldIndex,setHeldIndex] = useState()
    const[canOutside,setCanOutside] = useState(false)

    const handleDropDice = ()=>{
        if (turn&&canDropDice)
        {
            setCanDropDice(false);
            let dropdice= dropDice(board,0)
            setDice(dropdice.Dice)
            setCanFinish(dropdice.BoolCanFinish)
            handleUpdateBoard(board,dropdice.Dice,undo,false,!canPlay(board,dropdice.Dice,player))
        }
    }


const handleFinish = (board)=>{
    if(canFinish)
    {        
        setCanFinish(false)
        handleFinishTurn(board)
    }
}
const handleUndo = ()=>{
    let tempUndo = undo
    let tempPop = tempUndo.pop()
    setPlaceIndexes([])
    setBoard(tempPop)
    setUndo(tempUndo)
    setCanFinish((!canPlay(tempPop,dice,player)))
    setCanOutside(false)
    setHeldIndex()
    handleUpdateBoard(tempPop,dice,tempUndo,false,!canPlay(tempPop,dice,player))
}


const handlePickUp = (player,index)=>{
    setPlaceIndexes(canPlaceIndexes(board,dice,player,index))
    if(allPiecesInHome(board,player)&&canTakeOutSpecificPiece(board,index,player,dice))
    {setCanOutside(true)}
    else{setCanOutside(false)}
    setHeldIndex(index)

}
const handlePlace = (index)=>{
    let tempUndo = undo
    const tempBoard = board
    tempUndo.push(tempBoard)
    setUndo(tempUndo)
    let temp =Move(board,player,heldIndex,index)
    setPlaceIndexes([])
    setBoard(temp)
    setDice(updateDice(dice,index-heldIndex))
    setCanFinish((!canPlay(board,dice,player)))
    setCanOutside(false)
    setHeldIndex()
    handleUpdateBoard(board,dice,undo,canDropDice,!canPlay(board,dice,player))
}

  return (
    <>
        <button onClick={()=>handleDropDice()} disabled={!(turn&&canDropDice)}>ROLL</button>
        <button onClick={()=>handleUndo()} disabled={!(turn&&undo.length>0)}>UNDO</button> 
        <button onClick={()=>handleFinish(board)} disabled={!(turn&&canFinish)}>FINIS</button>     
        <div className = "board">
        <div className = "space"></div>



        { Array.from({ length: 6 }, (_, i) => (
            <>
                <div className='arrow'>
                <ArrowDown turn = {turn}  player={player} key ={12+i} odd={i%2!==0} count={board[0].data[12+i]+board[1].data[11-i]} mainPlayer={board[0].data[12+i]>0} canPickUp ={player===0?canMovePiece(board,dice,player,12+i):canMovePiece(board,dice,player,11-i)} handlePickUp ={handlePickUp} handlePlace={handlePlace}  index={12+i} canPlace={placeIndexes.includes(12+i)} />
                <ArrowUp  turn = {turn} player={player} key ={11-i} odd={i%2!==0} count={board[0].data[11-i]+board[1].data[12+i]}  mainPlayer={board[0].data[11-i]>0}  canPickUp ={player===0?canMovePiece(board,dice,player,11-i):canMovePiece(board,dice,player,12+i)} handlePickUp ={handlePickUp} handlePlace={handlePlace}  index={11-i} canPlace={placeIndexes.includes(11-i)} />
                </div>          
        
            </>
        ))}
        <MiddleBar turn = {turn} handlePickUp ={handlePickUp} player ={player} canReturnPiece={dice?canReturnEatenPiece(board,dice,player):undefined} player0count={board[0].eaten} player1count={board[1].eaten}/>
        <div className='dice'> 
              {dice&&!dice[0].used?dice[0].number:""} {dice&&!dice[1].used?dice[1].number:""} {dice&&!dice[2].used?dice[2].number:""} {dice&&!dice[3].used?dice[3].number:""}    
 
              </div>
        { Array.from({ length: 6 }, (_, i) => (
            <>
            <div className='arrow'>
            <ArrowDown  turn = {turn}  player={player} key ={18+i} odd={i%2!==0} count={board[0].data[18+i]+board[1].data[5-i]} mainPlayer={board[0].data[18+i]>0} canOutside={(dice&&allPiecesInHome(board,player)&&canTakeOutSpecificPiece(board,i+18,player,dice))}  canPickUp ={player===0?canMovePiece(board,dice,player,18+i):canMovePiece(board,dice,player,5-i)} handlePickUp ={handlePickUp} handlePlace={handlePlace} index={18+i} canPlace={placeIndexes.includes(18+i)} />
            <ArrowUp turn = {turn}  player={player} key ={5-i} odd={i%2!==0} count={board[0].data[5-i]+board[1].data[18+i]} mainPlayer={board[0].data[5-i]>0} canOutside={(dice&&allPiecesInHome(board,player)&&canTakeOutSpecificPiece(board,i+18,player,dice))}  canPickUp ={player===0?canMovePiece(board,dice,player,5-i):canMovePiece(board,dice,player,18+i)} handlePickUp ={handlePickUp} handlePlace={handlePlace} index={5-i} canPlace={placeIndexes.includes(5-i)} />
            </div>
  
            </>
       
        ))} 
        <EndBar  turn = {turn} player0count={board[0].outside} player1count={board[1].outside} canOutside={canOutside} handleOutside={handlePlace} />
        </div>

 </>


  )
}
export default BackgammonBoard

