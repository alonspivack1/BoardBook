import React,{useEffect,useState} from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [currentUserName,setCurrentUserName] = useState(undefined)
  useEffect(() => {
    async function fetchData() {
        const data = await JSON.parse(
            localStorage.getItem("board-book-user")
          );
          setCurrentUserName(data.username);
    }
    fetchData();
  }, []);   return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, {currentUserName}!
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;