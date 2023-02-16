import React, { useEffect, useState,useRef, useContext } from "react";
import { ChatContainerStyle } from "../styles/StyledComponents";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserByTokenRoute,allContactsRoute ,createRoomRoute,changeChatRoute,setGameIdToUserRoute} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import { SocketContext } from "../services/socket";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GameOfferToast from "../components/GameOfferToast";
import { ValidationToast } from "../styles/ValidationToast";


 export default function Chat() {
  
  const socket = useContext(SocketContext);
   const navigate = useNavigate();
   const [contacts, setContacts] = useState([]);
   const [currentUser, setCurrentUser] = useState(undefined);
   const [currentChat, setCurrentChat] = useState(undefined);



   
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
    //?socket.off("contact-users-updated")
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
      socket.on("add-contact",(contact)=>
      {
        let tempContacts = [...contacts]
        tempContacts.push(contact)
        setContacts(tempContacts)
      })
      socket.on("delete-contact",(contact)=>
      {
        let tempContacts = [...contacts]
        const index = tempContacts.findIndex(user => user._id === contact._id);
        tempContacts.splice(index, 1);
        setContacts(tempContacts)
      })   
      socket.on("game-offer",(data)=>
      {
        GameOfferToast(data.roomId,data.from)
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
  
  const handleGameOffer = () => {
  
  };
  const handleContacts = async (id) => {
    let updatedContacts = [...contacts]
    const index = updatedContacts.findIndex(user => user._id === id);
    updatedContacts[index].Notification=true
    setContacts(updatedContacts)
  };

  const deleteContact = (index)=>
  {

    socket.emit("delete-contact",{
      to: contacts[index]._id,
      contact: currentUser
    })
    
    let updatedContacts =[...contacts]
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts)
  }
  const addContact = (contact)=>
  {
    socket.emit("add-contact",{
      to: contact._id,
      contact: currentUser
    })
      let updatedContacts =[...contacts]
      updatedContacts.push(contact)
      setContacts(updatedContacts)

  }
  const handleCreateRoom = async () => {

    if(currentChat!=="")
    { 
        await axios.post(createRoomRoute, {
        users: [currentUser._id,currentChat._id]
      }
      ).then((response) => {
        if(response.data.gameCreateSuccessfully)
          {
             socket.emit("game-offer",{
              from:currentUser.username,
              to:currentChat._id,
              roomId:response.data.roomId
            }).then(
                window.open(`/gameroom/${response.data.roomId}`)
             )
          }
          else
          {
            toast.error(response.data.msg,ValidationToast);
          }
      }).catch((error)=> toast.error(error,ValidationToast))
       

    };
    }
    
     
  return (
    <>
      
    <ToastContainer/>
      {currentUser?
      (
        <ChatContainerStyle>
        <div className="container">
            <Contacts currentUserImage={currentUser.avatarImage} currentUserID ={currentUser._id}  currentUserName ={currentUser.username}  contacts={contacts} changeChat={handleChatChange} deleteContact={deleteContact} addContact={addContact} />
              <ChatContainer handleContacts={handleContacts}currentChat={currentChat} currentUser={currentUser} socket={socket} handleCreateRoom={handleCreateRoom} /> 
          </div>
        </ChatContainerStyle>
      ):""}
  
    </>
  );
}

