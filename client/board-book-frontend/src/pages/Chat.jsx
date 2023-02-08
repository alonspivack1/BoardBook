import React, { useEffect, useState,useRef, useContext } from "react";
import { ChatContainerStyle } from "../styles/StyledComponents";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserByTokenRoute,allContactsRoute ,createRoomRoute} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import { SocketContext } from "../services/socket";

 export default function Chat() {
  
  const socket = useContext(SocketContext);
   const navigate = useNavigate();
   const [contacts, setContacts] = useState([]);
   const [currentUser, setCurrentUser] = useState(undefined);
   const [currentChat, setCurrentChat] = useState(undefined);
   const [gameOffer, setGameOffer] = useState(false);


   const messageSentStatus = useRef(false);

   useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)) {
        navigate("/login");
      } else {
        const token =await localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)
        const data = await axios.get(`${getUserByTokenRoute}/${token}`);   
        if(!data)
        {
          localStorage.clear();
          navigate("/login");
        }
        else
        {
            setCurrentUser(data.data[0]);
           
        }
        }
        }
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
          const data = await axios.get(`${allContactsRoute}/${currentUser._id}`);   
          setContacts(data.data)
          setCurrentChat("")
          console.log(data)
      }}
    fetchData();
  }, [currentUser]); 
  
  
  const handleChatChange = (chat)=>{
    setCurrentChat(chat)
  }
  const handleGameOffer = (bool) => {
    setGameOffer(bool)
  };
  const handleCreateRoom = async () => {

  

    // if(currentChat!=="")
    // {
    //   await axios.post(createRoomRoute, {
    //     users: [currentUser._id,currentChat._id]
    //   }
    //   ).then((response) => {
    //     messageSentStatus.current = response.data.sentSuccessfully
    //     if(messageSentStatus.current)
    //       {
    //         window.open(`/gameroom/${response.data.roomId}`)
  
    //       }
    //   }).catch((error)=>alert("1"))
    //   if (messageSentStatus.current)
    //   {
    //   }
    //   else{
    //     alert("2")
    //   }
    // };
    }
 

  return (
    <>
      {currentUser?
      (
        <ChatContainerStyle>
        <div className="container">
            <Contacts currentUserImage={currentUser.avatarImage} currentUserName ={currentUser.username} gameOffer={gameOffer} contacts={contacts} changeChat={handleChatChange} />
              <ChatContainer gameOffer={gameOffer} handleGameOffer={handleGameOffer} currentChat={currentChat} currentUser={currentUser} socket={socket} />
  
          </div>
        </ChatContainerStyle>
      ):""}
  
    </>
  );
}

