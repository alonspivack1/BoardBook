import React, { useEffect, useState,useRef, useContext } from "react";
import { ChatContainerStyle } from "../styles/StyledComponents";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserByTokenRoute,allContactsRoute ,createRoomRoute,changeChatRoute} from "../utils/APIRoutes";
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
      socket.emit("add-user",currentUser._id,process.env.REACT_APP_STATUS_ONLINE)
    }
  },[socket,currentUser]);
  useEffect(()=>
  {
    console.log("Update Contacts")
    //?socket.off("contact-status-updated")
    if(contacts)
    {
      socket.on("contact-status-updated",(data)=>
      {
        let tempContacts = [...contacts]
        for (var i = 0; i < tempContacts.length; i++) {
          if (tempContacts[i]._id === data.id) {
            tempContacts[i].status = data.status;
            break;
          }
        }
        setContacts(tempContacts)
      })
      
    }
  },[socket,contacts])

  
  useEffect(() => {
    async function fetchData() {
      if (currentUser){
          const data = await axios.get(`${allContactsRoute}/${currentUser._id}`);   
          setContacts(data.data)
          setCurrentChat("")
      }}
    fetchData();
  }, [currentUser]); 
  
  
  const handleChatChange = async (chat)=>{
    if(chat)
    {
      chat.Notification=false
      setCurrentChat(chat)
      await axios.post(changeChatRoute, {UserId:currentUser._id, ContactID:chat._id})
    }
    else
    {
      setCurrentChat("")
    }

    }
  
  const handleGameOffer = (bool) => {
    setGameOffer(bool)
  };
  const handleContacts = async (id) => {
    let updatedContacts = [...contacts]
    const index = updatedContacts.findIndex(user => user._id === id);
    updatedContacts[index].Notification=true
    setContacts(updatedContacts)
  };

  const deleteContact = (index)=>
  {
    let updatedContacts =[...contacts]
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts)
  }
  const addContact = (contact)=>
  {
      let updatedContacts =[...contacts]
      updatedContacts.push(contact)
      setContacts(updatedContacts)
  }
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
            <Contacts currentUserImage={currentUser.avatarImage} currentUserID ={currentUser._id}  currentUserName ={currentUser.username} gameOffer={gameOffer} contacts={contacts} changeChat={handleChatChange} deleteContact={deleteContact} addContact={addContact} />
              <ChatContainer gameOffer={gameOffer} handleGameOffer={handleGameOffer} handleContacts={handleContacts}currentChat={currentChat} currentUser={currentUser} socket={socket} /> 
          </div>
        </ChatContainerStyle>
      ):""}
  
    </>
  );
}

