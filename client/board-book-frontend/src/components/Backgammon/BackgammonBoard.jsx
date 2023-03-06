import React, { useEffect, useState } from 'react'
import { allPiecesInHome, canMovePiece, canPlaceIndexes, canPlay, canReturnEatenPiece, canTakeOutSpecificPiece, dropDice, GetBoard, Move, updateDice } from './BackGammonLogic'

import './BackgammonBoard.css';
import MiddleBar from './MiddleBar';
import ArrowUp from './ArrowUp';
import ArrowDown from './ArrowDown';
import EndBar from './EndBar';

function BackgammonBoard({turn=true,player}) {
    const[board,setBoard] = useState(GetBoard())
    const[dice,setDice] = useState()
    const[canUndo,setCanUndo] = useState()
    const[canDropDice,setCanDropDice] = useState(true)
    const[canFinish,setCanFinish] = useState()
    const[placeIndexes,setPlaceIndexes] = useState([])
    const[heldIndex,setHeldIndex] = useState()
    const[canOutside,setCanOutside] = useState(false)


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


const handlePickUp = (player,index)=>{
    setPlaceIndexes(canPlaceIndexes(board,dice,player,index))
    if(allPiecesInHome(board,player)&&canTakeOutSpecificPiece(board,index,player,dice))
    {setCanOutside(true)}
    else{setCanOutside(false)}
    setHeldIndex(index)

}
const handlePlace = (index)=>{
    let temp =Move(board,player,heldIndex,index)
    setPlaceIndexes([])
    setBoard(temp)
    setDice(updateDice(dice,index-heldIndex))
    setCanFinish(!canPlay(board,dice,player))
    setCanOutside(false)
    setHeldIndex()
}

  return (
    <>
        <button onClick={()=>handleDropDice()} disabled={!(turn&&canDropDice)}>ROLL</button>
        <button onClick={()=>undo()} disabled={!(canUndo)}>UNDO</button> 
        <button onClick={()=>handleFinish()} disabled={!(canFinish)}>FINIS</button> 
        {console.log(board)}
    
        <div className = "board">
        <div className = "space"></div>



        { Array.from({ length: 6 }, (_, i) => (
            <>
                <div className='arrow'>
                <ArrowDown key ={12+i} odd={i%2!==0} count={board[0].data[12+i]+board[1].data[11-i]} mainPlayer={board[0].data[12+i]>0} canPickUp ={canMovePiece(board,dice,0,12+i)} handlePickUp ={handlePickUp} handlePlace={handlePlace}  index={12+i} canPlace={placeIndexes.includes(12+i)} />
                <ArrowUp key ={11-i} odd={i%2!==0} count={board[0].data[11-i]+board[1].data[12+i]}  mainPlayer={board[0].data[11-i]>0}  canPickUp ={canMovePiece(board,dice,0,11-i)} handlePickUp ={handlePickUp} handlePlace={handlePlace}  index={11-i} canPlace={placeIndexes.includes(11-i)} />
                </div>          
        
            </>
        ))}
        <MiddleBar handlePickUp ={handlePickUp} player ={player} canReturnPiece={dice?canReturnEatenPiece(board,dice,player):undefined} player0count={board[0].eaten} player1count={board[1].eaten}/>
        <div className='dice'> 
              {dice?dice[0].number:""},{dice?dice[1].number:""}    
              </div>
        { Array.from({ length: 6 }, (_, i) => (
            <>
            <div className='arrow'>
            <ArrowDown key ={18+i} odd={i%2!==0} count={board[0].data[18+i]+board[1].data[5-i]} mainPlayer={board[0].data[18+i]>0} canOutside={(dice&&allPiecesInHome(board,player)&&canTakeOutSpecificPiece(board,i+18,player,dice))}  canPickUp ={canMovePiece(board,dice,0,18+i)} handlePickUp ={handlePickUp} handlePlace={handlePlace} index={18+i} canPlace={placeIndexes.includes(18+i)} />
            <ArrowUp key ={5-i} odd={i%2!==0} count={board[0].data[5-i]+board[1].data[18+i]} mainPlayer={board[0].data[5-i]>0} canOutside={(dice&&allPiecesInHome(board,player)&&canTakeOutSpecificPiece(board,i+18,player,dice))}  canPickUp ={canMovePiece(board,dice,0,5-i)} handlePickUp ={handlePickUp} handlePlace={handlePlace} index={5-i} canPlace={placeIndexes.includes(5-i)} />
            </div>
  
            </>
       
        ))} 
        <EndBar player0count={board[0].outside} player1count={board[1].outside} canOutside={canOutside} handleOutside={handlePlace} />
        </div>

 </>


  )
}
export default BackgammonBoard

