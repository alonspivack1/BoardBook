import React from 'react'

function EndBar({player0count=0,player1count=0,canOutside,handleOutside}) {
    let player0margin = 0
    let player1margin = 655
    let player0changeMargin = 20
    let player1changeMargin = -20
  


    const BarHandleClick = ()=>{
        if(canOutside)
        {
            handleOutside(24)
        }
    }
  return (

    <>
    <div className = "space"></div>

    <div className={`end-bar ${canOutside?"can-outside":""}`} onClick={()=>BarHandleClick()}>
    { Array.from({ length: player0count }, (_, i) => (
    <div key={i} className={`Piece-0-outside`} style={{marginTop: `${player0margin + player0changeMargin*i}px`}}></div>
  ))}
      { Array.from({ length: player1count }, (_, i) => (
    <div key={i} className={`Piece-1-outside`} style={{marginTop: `${player1margin + player1changeMargin*i}px`}}></div>
  ))}
    </div>
    <div className = "space"></div>

  </>  )
}

export default EndBar