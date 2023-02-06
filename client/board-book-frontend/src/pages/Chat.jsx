import React, { useEffect, useState,useRef, useContext } from "react";
import { ChatContainerStyle } from "../styles/StyledComponents";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute ,createRoomRoute} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import { SocketContext } from "../services/socket";

 export default function Chat() {
  
  const socket = useContext(SocketContext);

   const navigate = useNavigate();
   const [contacts, setContacts] = useState([]);
   const [currentUser, setCurrentUser] = useState(undefined);
   const [currentChat, setCurrentChat] = useState(undefined);
   const messageSentStatus = useRef(false);

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

  useEffect(() => {
    if(currentUser)
    {
      socket.emit("add-user",currentUser._id)
    }
  });

  useEffect(() => {
    async function fetchData() {
      if (currentUser){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data)
          setCurrentChat("")
      }}
    fetchData();
  }, [currentUser]); 
  
  
  const handleChatChange = (chat)=>{
    setCurrentChat(chat)

  }
  
  const handleCreateRoom = async () => {
    if(currentChat!=="")
    {
      await axios.post(createRoomRoute, {
        users: [currentUser._id,currentChat._id]
      }
      ).then((response) => {
        messageSentStatus.current = response.data.sentSuccessfully
        if(messageSentStatus.current)
          {
            window.open(`/gameroom/${response.data.roomId}`)
  
          }
      }).catch((error)=>alert("1"))
      if (messageSentStatus.current)
      {
      }
      else{
        alert("2")
      }
    };
    }
 

  return (
    <>
      <ChatContainerStyle>
      <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
            <button onClick={handleCreateRoom}>Game</button>

        </div>
      </ChatContainerStyle>
    </>
  );
}

