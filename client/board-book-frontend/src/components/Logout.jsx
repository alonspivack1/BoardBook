import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import styles from "../styles/IconStyles.module.css"

import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
export default function Logout({socket,currentUserId}) {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    const token = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN));
    const data = await axios.get(`${logoutRoute}/${token}`);
    if (data.status === 200) {
      localStorage.clear();
      await socket.emit("logout",currentUserId)
      navigate("/login");
    }
  };
  return (
      <FaPowerOff onClick={()=>handleClick()} className={styles.logout} />
  );
}
