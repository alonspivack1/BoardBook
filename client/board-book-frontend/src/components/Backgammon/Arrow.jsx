import React from 'react'
import { Move } from './BackGammonLogic'
import Piece from './Piece'

function Arrow({odd=false, upcount =0,downcount=0,upmainplayer=true,downmainplayer=true,optionup=false,optiondown=false,handleClick,upIndex,downIndex}) {
  const ArrowHandleClick = ()=>{
    handleClick(upmainplayer)
  }
  return (
    <>
    <div>
    <div className={`arrow-down ${odd?"odd":"even"}`}>
        <div onClick={()=>ArrowHandleClick()} className={`arrow-up ${odd?"odd":"even"}`}>
        </div>
        <Piece option={optionup} count ={upcount} up={true} mainplayer={upmainplayer}/>
        <Piece option={optiondown} count ={downcount} up={false} mainplayer={downmainplayer}/>
        </div>

    </div>
 

    </>  )
}

export default Arrow