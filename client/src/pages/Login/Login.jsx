import React, { useState, useCallback, useEffect } from "react";
import "./login.scss";
import { Link, useNavigate }from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'
import {  userState$ } from '../../redux/selectors'
import {Pisdk} from '../../components/pisdk/pisdk.tsx'
const Login = () => {
  const [data, setData] = useState({userName: "",password: ""});
  const [errMessage, setErrMessage] = useState(null);
  const [isUserPi, setisUserPi] = useState(null);
  const loginSuccess = useSelector( userState$)

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = useCallback((e) => {
  try{
    e.preventDefault();
    dispatch(actions.login.loginRequest(data))
  }
  catch(err){ 
    dispatch(actions.login.loginFailure())
  }
},[dispatch, data])


const Pilogin = useCallback( async (e) => {

 
  try{
    e.preventDefault();
    const userPi = await Pisdk()
    setisUserPi(userPi.username)
    if (isUserPi) {
      dispatch(actions.login.loginSuccess(isUserPi))
    }
  }
  catch(err){ 
    dispatch(actions.login.loginFailure())
  }
 
  

},[])


useEffect(()=>{
  if(!loginSuccess.isLoggedIn){
    setErrMessage(loginSuccess.err)
  }
},[loginSuccess])
useEffect(()=> {
  if(loginSuccess.token){
    localStorage.setItem("token",loginSuccess.token)
  }
  else{
    localStorage.removeItem("token")
  }
},[loginSuccess])
useEffect(()=> {
  if(loginSuccess.currentUser){
    window.location.href = '/';
  }
},[navigate, loginSuccess])
  return (
    <div className="login">
      <div className="login__container">
        <Link to="/" className="login__logo">
          <img
            src="/icons/singleLogo.png"
            alt=""
          />
        </Link>
        <p>{errMessage}</p>
        <form action="" method="POST" className="login__form" >
          <input
            type="text"
            placeholder="Username"
            name="userName"
            className="login__form-input"
            value={data.userName}
            onChange={(e) => setData({ ...data, userName: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="login__form-input"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button className="login__form-button" type="submit" onClick={onSubmit}>
            Login
          </button>
        </form>
        <form className="login__form">
        <p className='auth__logging-tilte'>Or Login with Pi Browser</p>
                     <div className="">
                         

                         <button  className="login__form-button" type ="submit" value="Xác nhận" onClick={Pilogin}>Auth with Pi Browser</button>
                      
                     </div></form>
                 
        <Link to="/">
          <p className="login__text link">Forgot Password?</p>
        </Link>
        <span className="login__text">Don't have Piora Account?</span>
        <a href="/register">
          <span className="login__text link"> Sign up now</span>
        </a>
      </div>
    </div>
  );
};
export default Login;
