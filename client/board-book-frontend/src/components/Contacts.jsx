import React, { useState, useEffect } from "react";
import { ContactsContainerStyle } from "../styles/StyledComponents";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";

 export default function Contacts({ contacts, changeChat, gameOffer}) {
   const [currentUserName, setCurrentUserName] = useState(undefined);
   const [currentUserImage, setCurrentUserImage] = useState(undefined);
   const [currentSelected, setCurrentSelected] = useState(undefined);

   useEffect(() => {
    async function fetchData() {
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)
          );
          setCurrentUserName(data.username);
          setCurrentUserImage(data.avatarImage);
        }
    fetchData();
  }, []); 
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
              console.log(contacts)
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
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                  <div> {contact.Notification?"New":""}</div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              
              <img
                      src={currentUserImage?`data:image/svg+xml;base64,${currentUserImage}`:""}
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
