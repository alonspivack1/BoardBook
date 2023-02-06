import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Chat from './pages/Chat';
import Game from './pages/Game';
import Login from './pages/Login';
import Register from './pages/Register';
import { socket, SocketContext } from './services/socket';


export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
        <Route path="/register" element = {<Register/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/" element = {<Chat/>}/>
        <Route path="/gameroom/:roomId" element = {<Game/>}/>

        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  ) 
}
