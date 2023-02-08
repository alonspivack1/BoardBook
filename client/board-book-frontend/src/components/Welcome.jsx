import React from "react";
import { WelcomeContainerStyle } from "../styles/StyledComponents";
import Robot from "../assets/robot.gif";
export default function Welcome(username) {

    <WelcomeContainerStyle>
      <img src={Robot} alt="" />
      <h1>
        Welcome, {username}!
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </WelcomeContainerStyle>
}
