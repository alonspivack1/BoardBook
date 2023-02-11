import React, { useState, useEffect } from "react";
import { ContactsContainerStyle } from "../styles/StyledComponents";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import Avatars from "../styles/AvatarsArray";
import { AiOutlineMessage } from "react-icons/ai";
import axios from "axios";
import { SearchUsersRoute } from "../utils/APIRoutes";

 export default function Contacts({ contacts, currentUserImage,currentUserName,changeChat, gameOffer}) {
   const [currentSelected, setCurrentSelected] = useState(undefined);
   const [contactsOnline,setContactsOnline] = useState(true);
   const [contactsInGame,setContactsInGame] = useState(true);
   const [contactsOffline,setContactsOffline] = useState(true);
   const [Search,setSearch] = useState(true);
   const [searchValue,setSearchValue] = useState("");
   const [contactsSearch,setContactsSearch] = useState();

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

      if (status===process.env.REACT_APP_STATUS_ONLINE)
      {
        if(contactsOnline)
        {
          return  true
        }
      }
      else if(status===process.env.REACT_APP_STATUS_OFFLINE)
      {
        if(contactsOffline)
        {
          return  true
        }
      }
      else if(status === process.env.REACT_APP_STATUS_INGAME)
      {
        if(contactsInGame)
        {
          return  true
        }
      }
    }
    return false
   }


   const handleSearch = async (value)=>{
    setSearchValue(value)

    if(value.length>=3)
    {
      const data = await axios.get(`${SearchUsersRoute}/${value}/${currentUserName}`);   
      setContactsSearch(data.data)
    }
    else
    {
      setContactsSearch()

    }
   }
  
   return(
    <>
    <ContactsContainerStyle>
    <div className="brand">
            <Logout/>
            <h3>{process.env.REACT_APP_NAME}</h3>
            <img src={Logo} alt="logo" />
          </div>
          {Search===true?(
            <>
            <div>
              <input
                type="text"
                placeholder="search contact"
                value={searchValue}
                onChange={(event) => handleSearch(event.target.value)}/>
            </div>
           
           {contactsSearch?(       
            <>     
            {contactsSearch.length===0?
            (
              <h3 style={{ color: 'white' }}>No suitable user found</h3>
            ):""}
            <div className="contacts">
            {contactsSearch.map((contact, index) => {
              return (       
                <div 
                  key={contact._id}
                  className="contact"
                  onClick={() => changeCurrentChat(index, contact)} >
                  <div className={`avatar`}>
                    
                    <img
                      src ={Avatars[contact.avatarImage]}          
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
            </>
            ):(<div className="username">
              <h3 style={{ color: 'white' }}>Search with at least 3 chars and max 20</h3>
            </div>)}
          
            </>
            ):
    (
     <>
     
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
                  <div className={`avatar ${contact.status}`}>
                    
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
          </> 
    )
    }
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
