import React from 'react'
import Piece from './Piece'

function ArrowUp({turn,odd=false, player,count =0,mainPlayer=true,canOutside=false,canPickUp=false,handlePickUp,handlePlace,index,canPlace=false}) {
    const ArrowHandleClick = (canPickUp,canPlace,index,mainPlayer)=>{
      if(turn)
      {
        if(player===1)
        {
          index=23-index
        }
        if(canPlace)
        {
            
            handlePlace(index)
        }
        else
        {
            if(canPickUp||canOutside)
            {
              let player;
              mainPlayer?player=0:player=1
              handlePickUp(player,index)
            }
        } 
      }
        
        
  }
  return (
    <>
        <div onClick={()=>ArrowHandleClick(canPickUp,canPlace,index,mainPlayer)} className={`arrow-up ${odd?"odd":"even"} ${canPlace?"arrow-can-place":""}`}>
        <Piece canPickUp={turn&&(canPickUp||canOutside)} count ={count} up={false} mainPlayer={mainPlayer}/>
        </div>
    </>  )
}

export default ArrowUp