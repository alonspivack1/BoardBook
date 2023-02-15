import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GameOfferToastStyle } from "../styles/GameOfferToastStyle";
const GameOfferToast = (id,username) => {
  const handleButtonAccept = () => {
    window.open(`/gameroom/${id}`)
    toast.dismiss(id);


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
