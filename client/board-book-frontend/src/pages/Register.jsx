
import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { RegisterFormContainerStyle } from '../styles/StyledComponents';
import Logo from "../assets/logo.svg";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import Avatars from '../styles/AvatarsArray';
import { ValidationToast } from '../styles/ValidationToast';

import { registerRoute } from '../utils/APIRoutes';


export default function Register() {

    const navigate = useNavigate();

    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  
    const [values,setValues] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
        AvatarImage:1
    })

        useEffect(() => {
          if (localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN)) {
          navigate("/");
          }}, [] );


    const  handleSubmit = async (event)=>{
        event.preventDefault();
        if(handleValidation())
        {
            console.log("in Validation",registerRoute)
            const { username, email, password,AvatarImage} = values;
                const {data} = await axios.post(registerRoute,
                    {username,password,email,AvatarImage}).catch();
            if (data.status===false)
            {
                toast.error(data.msg,ValidationToast);
            }
            if (data.status===true)
            {
                localStorage.setItem(process.env.REACT_APP_USER_LOCALSTORAGE_TOKEN,JSON.stringify(data.token))
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
        ValidationToast);
        return false;
        }else if (username.length<3)
        {
            toast.error(
                "Username should be greater than 3 characters",ValidationToast
            );return false
        }
        else if (password.length<8)
        {
            toast.error(
                "Password should be equal or  greater than 8 characters",ValidationToast
            );return false
        }
        else if (email==="")
        {
            toast.error(
                "email is required",ValidationToast
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
            <h1>{process.env.REACT_APP_NAME}</h1>
          </div>
          <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <select name="AvatarImage" value={values.AvatarImage} onChange={e =>handleChange(e)}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <br />
      <br />
      <img src={Avatars[values.AvatarImage-1]} width = "100" height="100" alt="Selected Option" />
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

