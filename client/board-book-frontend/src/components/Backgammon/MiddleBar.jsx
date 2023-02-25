import React from 'react'

function MiddleBar({player0count=0,player1count=0,onClick}) {
    let player0margin = 0
    let player1margin = 655
    let player0changeMargin = 20
    let player1changeMargin = -20

  return (

    <>
            <div className = "space"></div>

    <div className={"middle-bar"}>
    { Array.from({ length: player0count }, (_, i) => (
    <div key={i} className="Piece-0-dead" style={{marginTop: `${player0margin + player0changeMargin*i}px`}}></div>
  ))}
      { Array.from({ length: player1count }, (_, i) => (
    <div key={i} className={`Piece-1-dead`} style={{marginTop: `${player1margin + player1changeMargin*i}px`}}></div>
  ))}
    </div>
    <div className = "space"></div>

  </>  )
}

export default MiddleBar