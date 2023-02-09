import React, { useState, useEffect } from "react";
import { ContactsContainerStyle } from "../styles/StyledComponents";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import Avatars from "../styles/AvatarsArray";
import { AiOutlineMessage } from "react-icons/ai";

 export default function Contacts({ contacts, currentUserImage,currentUserName,changeChat, gameOffer}) {
   const [currentSelected, setCurrentSelected] = useState(undefined);


   const changeCurrentChat = (index, contact) => {
    if(gameOffer===false)
    {
      setCurrentSelected(index);
      changeChat(contact);
    }

   };
   return(
    <>
    <ContactsContainerStyle>
    <div className="brand">
            <Logout/>
            <h3>{process.env.REACT_APP_NAME}</h3>
            <img src={Logo} alt="logo" />

          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
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
