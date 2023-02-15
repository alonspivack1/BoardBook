import React from "react";
import { GiRollingDices } from "react-icons/gi";
import { GameOfferButtonStyle } from "../styles/StyledComponents";

export default function GameOfferButton({handleGameOffer}) {

    return (
        <GameOfferButtonStyle onClick={()=>handleGameOffer()}>
          <GiRollingDices/>
        </GameOfferButtonStyle>
      );
  };


