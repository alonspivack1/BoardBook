import React from "react";
import { GiRollingDices } from "react-icons/gi";
import { GameOfferButtonStyle } from "../styles/StyledComponents";

export default function GameOfferButton({handleGameOffer}) {
  const handleClick =  () => {
    handleGameOffer(true)
    }
    return (
        <GameOfferButtonStyle onClick={handleClick}>
          <GiRollingDices />
        </GameOfferButtonStyle>
      );
  };


