import React,{useEffect,useState} from "react";
import { WelcomeContainerStyle } from "../styles/StyledComponents";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [currentUserName,setCurrentUserName] = useState(undefined)
  useEffect(() => {
    async function fetchData() {
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)
          );
          setCurrentUserName(data.username);
    }
    fetchData();
  }, []);   return (
    <WelcomeContainerStyle>
      <img src={Robot} alt="" />
      <h1>
        Welcome, {currentUserName}!
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </WelcomeContainerStyle>
  );
}
