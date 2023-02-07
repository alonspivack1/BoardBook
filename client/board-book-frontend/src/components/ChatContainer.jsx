import React, { useState, useEffect, useRef } from "react";
import { ChatContainerContainerStyle } from "../styles/StyledComponents";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute} from "../utils/APIRoutes";
import Welcome from "./Welcome";
import GameOfferDialog from "./GameOfferDialog";
import GameOfferButton from "./GameOfferButton";


export default function ChatContainer({ currentUser,currentChat,socket,gameOffer,handleGameOffer}) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const messageSentStatus = useRef(false);


  useEffect(() => {
    if (currentChat)
    {
      async function fetchData() {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)
        );
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
      fetchData();
    }

  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)
    );
  
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    }).then((response) => {
      messageSentStatus.current = response.data.sentSuccessfully
    }).catch((error)=>alert("ERROR: NETWORK ERROR!"))
    if (messageSentStatus.current)
    {
      socket.emit("send-msg",
      {
        to:currentChat._id,
        from:currentUser._id,
        message:msg,
      });
  
  
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    }
    else{
      alert("Error!, message didnt sent")
    }
  };

  useEffect(()=>{
    if(socket)
    {
      socket.off("msg-receive")
      socket.on("msg-receive",(msg)=>
      {
        if(currentChat!==""&&msg.from===currentChat._id)
         setArrivalMessage({fromSelf: false, message:msg.message})
         else{
          alert(msg.from+" sent message for you!")
         }
      })}})

  useEffect(() => {

    if (arrivalMessage)
      setMessages((prev) => [...prev, arrivalMessage]);
  } , [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);




  
  return (
    currentChat&&currentChat!==""?
    <>
    {gameOffer===true?
    (
        <>
              <GameOfferDialog gameOffer={gameOffer} handleGameOffer={handleGameOffer}/> 
        </>
        )
    :
    (
      
      <ChatContainerContainerStyle>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <GameOfferButton handleGameOffer={handleGameOffer}/>

      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "received"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </ChatContainerContainerStyle>
    )}
  
    </>:<Welcome/>
    
  );
}

