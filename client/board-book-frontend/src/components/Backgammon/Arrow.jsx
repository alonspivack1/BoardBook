import React from 'react'
import Piece from './Piece'

function Arrow({odd=false, upcount =0,downcount=0,upmainplayer=true,downmainplayer=true,optionup=false,optiondown=false}) {
  return (
    <>
    <div className={`arrow-down ${odd?"odd":"even"}`}>
        <div className={`arrow-up ${odd?"odd":"even"}`}>
        </div>
        <Piece option={optionup} count ={upcount} up={true} mainplayer={upmainplayer}/>
        <Piece option={optiondown} count ={downcount} up={false} mainplayer={downmainplayer}/>
        </div>

    </>  )
}

export default Arrow