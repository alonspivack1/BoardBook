import React from 'react'
import './BackgammonBoard.css';

function Piece({count=0,up=true,mainPlayer=true,canPickUp=true}) {
    let margin;
    let changeMargin;
    up?changeMargin=25:changeMargin=-25;
    up?margin=-270:margin=380;

  return (
    <>
    {mainPlayer?
    (
        <>
        { Array.from({ length: count }, (_, i) => (
    <div key={i} className={`Piece ${up?"":"Down"} ${canPickUp?"canPickUp":""}`} style={{marginTop: `${margin + changeMargin*i}px`}}></div>
  ))}
  </>
    ):
    (
        <>
        { Array.from({ length: count }, (_, i) => (
    <div key={i} className={`Piece SecondPiece ${up?"":"Down"} ${canPickUp?"canPickUp":""}`} style={{marginTop: `${margin + changeMargin*i}px`}}></div>
  ))}
  </>

    )}
    

    </>
    
  )
}

export default Piece