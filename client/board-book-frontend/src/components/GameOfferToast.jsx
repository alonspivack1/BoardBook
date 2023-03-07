import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GameOfferToastStyle } from "../styles/GameOfferToastStyle";
import { setGameIdToUserRoute } from "../utils/APIRoutes";
const GameOfferToast = (id,username,currentId) => {
  const handleButtonAccept = async() => {
       await axios.post(setGameIdToUserRoute, {
         id: currentId,
         gameId:id
     }).then((res)=>
     {
      window.open(`/gameroom/${res.data.gameId}`)
      toast.dismiss(id);
     })

  };
  const handleButtonDecline = () => {
    toast.dismiss(id);
    
  };
 
  return (
          toast(
            <div style={GameOfferToastStyle.customToast}>
              <span style={GameOfferToastStyle.toastText}>
                {username} ordered you to backgammon! Do you accept?
              </span>
              <div>
                <button
                  style={{ ...GameOfferToastStyle.button, ...GameOfferToastStyle.acceptButton }}
                  onClick={() => handleButtonAccept()}
                >
                  Accept
                </button>
                <button
                  style={{ ...GameOfferToastStyle.button, ...GameOfferToastStyle.declineButton }}
                  onClick={() => handleButtonDecline()}
                >
                  Decline
                </button>
              </div>
            </div>,
            { autoClose: 10000,closeOnClick: false, pauseOnHover: false,toastId:id}
          )

  )
   }

export default GameOfferToast;
