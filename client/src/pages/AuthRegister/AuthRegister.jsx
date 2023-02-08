import React, {useCallback, useEffect, useState} from 'react'
import {Link, useNavigate } from "react-router-dom"

import axios from 'axios'
import { useSelector } from 'react-redux'
import {  userState$ } from '../../redux/selectors'
import {Pisdk} from '../../components/pisdk/pisdk.tsx'

import './authregister.scss'
const AuthRegister = () => {

  const navigate = useNavigate()
  const loginSuccess = useSelector( userState$)
  const [email, setEMail] = useState({});
  const [visible, setVisible] = useState(false)
  const [messages, setMessages] = useState(null)
  const [err, setErr] = useState(false)
  const [isUserPi, setisUserPi] = useState()
  

  useEffect(()=> {
    if(loginSuccess.token){
      localStorage.setItem("token",loginSuccess.token)
    }
    else{
      localStorage.setItem("token",'')
    }
  },[loginSuccess])
  useEffect(()=> {
    if(loginSuccess.currentUser){
      window.location.href = '/';
    }
  },[navigate, loginSuccess])
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  },[])
  const handleAuthMail = useCallback( async (e) => {
    e.preventDefault();
    const userPi = await Pisdk()
    setisUserPi(userPi.username)
    setEMail({email: `${userPi.username}`})
   
    const option  ={
      method: "post", 
      url:`/api/v1/auth/send`,
      data: {email: `${userPi.username}`}
    }
    

    const response = await axios(option)
    setMessages(response.data.data)
   if (response.data.status=='OK') setVisible(!visible)
    setErr(false)
  },[visible,email])
    

 


  const handleSubmitOTP = useCallback( async (e) => {
    e.preventDefault();
    try{
      const option  ={
        method: "post", 
        url:`/api/v1/auth/mail`,
        data:{
          "otp" : 241001
        }
      }
      const response = await axios(option)
      navigate(`/tao-tai-khoan?token=${response.data.data}&email=${email.email}`)
    }
    catch(err) {
      setErr(true)
      setMessages(err.response.data.data)
    }
  },[navigate,email])
  
 
     return (
       <>
         {messages ? (
           <div className="alert-auth ">
             <div className={`uk-alert ${err ? "err" : ""}`}>
               <div>{messages}</div>
             </div>
           </div>
         ) : ""}

         <div className="auth">
           <div className="auth__container">
             <div className="auth__content">
               <div className="auth__logo">
                 <Link to="/">
                   <img src="/icons/singleLogo.png" alt="" />
                 </Link>
               </div>
               
               <div className="auth__logging">
               {!visible ? (
                    <><p className='auth__logging-tilte'>Sign up with Pi Browser</p><form className="auth__logging-email" onSubmit={handleSubmit}>
                     <div className="auth__logging-email-sending">
                         <div className="piauth">

                         <button type ="submit" value="Xác nhận" onClick={handleAuthMail}>Auth with Pi Browser</button>
                       </div>
                     </div>
                   </form></> 
                 ) : ""}
               
                 {visible ? (
                   <form action="" onSubmit={handleSubmit}>
                     <div className="otp">
                     <div>
                      <p>Are you <b>{isUserPi}</b></p>
                     </div>
                       <button type="submit" onClick={handleSubmitOTP}>Yes</button>
                     </div>
                   </form>
                 ) : ""}
               </div>
               <div className="auth__back">
                 <p>
                   <span className='auth__logging-tilte'>Have an account? </span>
                   <Link to="/login" className="auth__back-login">Login</Link>
                 </p>
               </div>
             </div>
           </div>
         </div>
       </>
     )
   }

export default AuthRegister