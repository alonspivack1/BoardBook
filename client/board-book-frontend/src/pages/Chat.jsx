import React, { useEffect, useState,useRef } from "react";
import { ChatContainerStyle } from "../styles/StyledComponents";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute ,host} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import {io} from "socket.io-client"
import ChatContainer from "../components/ChatContainer";

 export default function Chat() {
   const socket = useRef();
   const navigate = useNavigate();
   const [contacts, setContacts] = useState([]);
   const [currentUser, setCurrentUser] = useState(undefined);
   const [currentChat, setCurrentChat] = useState(undefined);

   useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)));
            }}
    fetchData();
  }, []); 
  useEffect(()=>{
    if(currentUser)
    {
      socket.current=io(host)
      socket.current.emit("add-user",currentUser._id)
    }
  })

  useEffect(() => {
    async function fetchData() {
      if (currentUser){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data)
      }}
    fetchData();
  }, [currentUser]); 
  
  
  const handleChatChange = (chat)=>{
    setCurrentChat(chat)
  }

  return (
    <>
      <ChatContainerStyle>
      <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
          )}
        </div>
      </ChatContainerStyle>
    </>
  );
}

