import React from 'react'
import './BackgammonBoard.css';
import { GetBoard, Move } from './BackGammonLogic';

function Piece({count=1,up=true,mainplayer=true,option=false}) {
    let margin;
    let changeMargin;
    up?changeMargin=25:changeMargin=-25;
    up?margin=-270:margin=380;

    const handleClick =()=>{
  
    }
  return (
    <>
    {mainplayer?
    (
        <>
        { Array.from({ length: count }, (_, i) => (
    <div key={i} className={`Piece ${up?"":"Down"} ${option?"option":""}`} style={{marginTop: `${margin + changeMargin*i}px`}}></div>
  ))}
  </>
    ):
    (
        <>
        { Array.from({ length: count }, (_, i) => (
    <div key={i} className={`Piece SecondPiece ${up?"":"Down"} ${option?"option":""}`} style={{marginTop: `${margin + changeMargin*i}px`}}></div>
  ))}
  </>

    )}
    

    </>
    
  )
}

export default Piece