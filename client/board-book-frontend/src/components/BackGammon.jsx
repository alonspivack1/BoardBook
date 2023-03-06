import React from 'react'
import BackgammonBoard from './Backgammon/BackgammonBoard'

function BackGammon() {
  return (
    <>
        <div>BackGammon</div>
    <BackgammonBoard turn = {true} player ={0}/>
    </>

  )
}

export default BackGammon