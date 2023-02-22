import React, { useState, useEffect } from "react";
import { ContactsContainerStyle } from "../styles/StyledComponents";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import Avatars from "../styles/AvatarsArray";
import { AiOutlineMessage } from "react-icons/ai";
import { MdPersonSearch,MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import { SearchUsersRoute,addContactRoute,deleteContactRoute } from "../utils/APIRoutes";
import styles from "../styles/IconStyles.module.css"
 export default function Contacts({ socket, contacts, currentUser,changeChat,deleteContact,addContact}) {
   const [currentSelected, setCurrentSelected] = useState(undefined);
   const [contactsOnline,setContactsOnline] = useState(true);
   const [contactsInGame,setContactsInGame] = useState(true);
   const [contactsOffline,setContactsOffline] = useState(true);
   const [Search,setSearch] = useState(false);
   const [searchValue,setSearchValue] = useState("");
   const [contactsSearch,setContactsSearch] = useState();
   const [timer, setTimer] = useState(null);


   const changeCurrentChat = (index, contact) => {
      setCurrentSelected(index);
      changeChat(contact);
    
   };
   const handleAddContact = async (contact) => {
    await axios.post(addContactRoute, {firstID:currentUser._id, secondID:contact._id}).then((data)=>
    {
      if(data.data.success)
      {
        addContact(contact)
        setSearchValue("")
        setContactsSearch(undefined)
        setSearch(false) 
      
      }
      else
      {
        alert("network error")
      }
    })
    
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
   

  const handleHoldStart = (contactID,index) => {
    setTimer(setTimeout(() => handleDeleteContact(contactID,index), 3000));
  };

  const handleHoldEnd = () => {
    clearTimeout(timer);
  };

  const handleDeleteContact = async (contactID,index) => {
    await axios.post(deleteContactRoute, {firstID:currentUser._id, secondID:contactID}).then((data)=>{
      if(data.data.success)
      {
        clearTimeout(timer);
        deleteContact(index)
        changeCurrentChat(undefined,undefined);
      }
      else
      {
        alert("network error")
      }
    })
   }; 
   
   
   const handleSearch = async (value)=>{
    setSearchValue(value)

    if(value.length>=3)
    {
      const data = await axios.get(`${SearchUsersRoute}/${value}/${currentUser.username}`);   
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
            <Logout socket={socket} currentUserId={currentUser._id}/>
            <h3>{process.env.REACT_APP_NAME}</h3>
            <img src={Logo} alt="logo" />
          </div>
          {Search===true?(
            <>
            <div className="searcharea">
            <MdOutlineCancel className={styles.backtocontacts} onClick={()=>{  setContactsSearch(undefined);setSearchValue(""); setSearch(!Search)}}/>
              <input
                maxLength={20}
                type="text"
                placeholder="search user"
                value={searchValue}
                onChange={(event) => handleSearch(event.target.value)} autoFocus/>

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
                  onClick={() => handleAddContact(contact)} >
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
              <h3 style={{ color: 'white' }}>Please enter at least 3 characters to search...</h3>
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
              <MdPersonSearch className={styles.search} onClick={()=> {changeCurrentChat(undefined,undefined); setSearch(!Search)}}/>

          </div>
          <div className="contacts">
            {contacts.filter(contact => DisplayContactDependStatus(contact.status)===true).map((contact, index) => {

              return (
                
                <div 
                  key={contact._id}
                  onMouseDown={()=>handleHoldStart(contact._id,index)} onMouseUp={()=>handleHoldEnd()}
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
                   <AiOutlineMessage className={styles.notification}/>   
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
                      src={Avatars[currentUser.avatarImage]}
                      alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUser.username}</h2>
            </div>
          </div>
    </ContactsContainerStyle>
    </>
   )

}
