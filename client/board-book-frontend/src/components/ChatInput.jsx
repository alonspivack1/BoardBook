import React,{useState} from 'react'
import { ChatInputContainerStyle } from '../styles/StyledComponents';
import {IoMdSend} from 'react-icons/io'
export default function ChatInput({ handleSendMsg }) {
    const [msg, setMsg] = useState("");

  

  
    const sendChat = (event) => {
      event.preventDefault();
      if (msg.length > 0) {
        handleSendMsg(msg);
        setMsg("");
      }
    };
    return (
        <ChatInputContainerStyle>
          <div className="button-container">

          </div>
          <form className="input-container" onSubmit={(event) => sendChat(event)}>
            <input
              type="text"
              placeholder="type your message here"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
            />
            <button type="submit">
              <IoMdSend />
            </button>
          </form>
        </ChatInputContainerStyle>
      );
    }
    
