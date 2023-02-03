
import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { RegisterFormContainerStyle } from '../styles/StyledComponents';
import Logo from "../assets/logo.svg";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";

import { registerRoute } from '../utils/APIRoutes';


export default function Register() {

    const navigate = useNavigate();

    const [values,setValues] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
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


    const  handleSubmit = async (event)=>{
        event.preventDefault();
        if(handleValidation())
        {
            console.log("in Validation",registerRoute)
            const { username, email, password} = values;
                const {data} = await axios.post(registerRoute,
                    {username,password,email});
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
    //! update validation for email and for username (_ char) and lower case username at server
    const handleValidation = () =>{
        const { username, email, password, confirmPassword } = values;
        if (password !== confirmPassword) {
        toast.error("password and confirm password should be same.",
        toastOptions);
        return false;
        }else if (username.length<3)
        {
            toast.error(
                "Username should be greater than 3 characters",toastOptions
            );return false
        }
        else if (password.length<8)
        {
            toast.error(
                "Password should be equal or  greater than 8 characters",toastOptions
            );return false
        }
        else if (email==="")
        {
            toast.error(
                "email is required",toastOptions
            );return false
        }
        return true
    };
  return  (
    <>
      <RegisterFormContainerStyle>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Board Book</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </RegisterFormContainerStyle>
      <ToastContainer />
    </>
  );
}

