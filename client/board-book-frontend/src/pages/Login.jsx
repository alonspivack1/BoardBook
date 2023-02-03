
import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { LoginFormContainerStyle } from '../styles/StyledComponents';
import Logo from "../assets/logo.svg";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";

import { loginRoute } from '../utils/APIRoutes';


export default function Login() {

    const navigate = useNavigate();

    const [values,setValues] = useState({
        username:"",
        password:"",
    })

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
        }


        useEffect(() => {
          if (localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME)) {
          navigate("/");
          }}, [] );

    const handleSubmit = async (event)=>{
        event.preventDefault();
        if(handleValidation())
        {
            console.log("in Validation",loginRoute)
            const { username, password} = values;
                const {data} = await axios.post(loginRoute,
                    {username,password});
            if (data.status===false)
            {
                toast.error(data.msg,toastOptions);
            }
            if (data.status===true)
            {
                localStorage.setItem(process.env.REACT_APP_USER_LOCALSTORAGE_NAME,JSON.stringify(data.user))
                navigate("/");
            }
        }
  
    }
    const handleChange = (event)=>{
        let UpdatedValues = {...values}
        UpdatedValues[event.target.name] = event.target.value
        setValues(UpdatedValues)
    }
    //! update validation for username (_ char) and check if .lower case username in server
    const handleValidation = () =>{
        const { username, password} = values;
        if (username.length===0||password.length===0)
        {
            toast.error(
                "Username and Password is required",toastOptions
            );return false
        }
        return true
    };
  return  (
    <>
      <LoginFormContainerStyle>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Board Book</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            min = "3"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login</button>
          <span>
            D'ont have an account ? <Link to="/register">Register</Link>
          </span>
        </form>
      </LoginFormContainerStyle>
      <ToastContainer />
    </>
  );
}

