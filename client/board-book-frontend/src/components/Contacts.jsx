import React, { useState, useEffect } from "react";
import { ContactsContainerStyle } from "../styles/StyledComponents";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import Avatars from "../styles/AvatarsArray";
import { AiOutlineMessage } from "react-icons/ai";

 export default function Contacts({ contacts, currentUserImage,currentUserName,changeChat, gameOffer}) {
   const [currentSelected, setCurrentSelected] = useState(undefined);
   const [contactsOnline,setContactsOnline] = useState(true);
   const [contactsInGame,setContactsInGame] = useState(true);
   const [contactsOffline,setContactsOffline] = useState(false);


   const changeCurrentChat = (index, contact) => {
    if(gameOffer===false)
    {
      setCurrentSelected(index);
      changeChat(contact);
    }

   };
   const DisplayContactDependStatus=(status)=>
   {
    if (status!=="")
    {

      if (status==="online")
      {
        if(contactsOnline)
        {
          return  true
        }
      }
      else if(status==="offline")
      {
        if(contactsOffline)
        {
          return  true
        }
      }
      else if(status === "ingame")
      {
        if(contactsInGame)
        {
          return  true
        }
      }
    }

    return false
   }
   return(
    <>
    <ContactsContainerStyle>
    <div className="brand">
            <Logout/>
            <h3>{process.env.REACT_APP_NAME}</h3>
            <img src={Logo} alt="logo" />
          </div>
          <div className="fragment">
            <button onClick={()=>setContactsOnline((prev)=>!prev)}
              className={`${contactsOnline ? "selected" : ""}`}
              >online</button>
            <button onClick={()=>setContactsInGame((prev)=>!prev)}
              className={`${contactsInGame ? "selected" : ""}`}
              >in-game</button>
            <button onClick={()=>setContactsOffline((prev)=>!prev)}
              className={`${contactsOffline ? "selected" : ""}`}
              >offline</button>

          </div>
          <div className="contacts">
            {contacts.filter(contact => DisplayContactDependStatus(contact.status)===true).map((contact, index) => {

              return (
                
                <div 
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)} >
                  <div className="avatar">
                    
                    <img
                      src ={Avatars[contact.avatarImage]}          
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                  <div> {(contact.Notification)?
                  (
                   <AiOutlineMessage style={{
                    height: "20px",
                    width: "20px",
                    color: "white"
                  }}/>
                    
                  ):""}</div>
                </div>
              );

            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              
              <img
                      src={Avatars[currentUserImage]}
                      alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
    </ContactsContainerStyle>
    </>
   )

}
