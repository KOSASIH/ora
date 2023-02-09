import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./register.scss";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import { userState$ } from "../../redux/selectors";
const Register = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const uidFb = searchParams.get("uid");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate, uidFb]);
  const dispatch = useDispatch();
  const [errMessages, setErrMessages] = useState([]);
  const loginSuccess = useSelector(userState$);
  const [data, setData] = useState({
    userName: "",
    displayName: "",
    password: "",
    mobile: "",
    identification: "",
    socialIdFacebook: uidFb,
    mail: email,
  });
  const onSubmit = useCallback(
    (e) => {
      try {
        e.preventDefault();
        dispatch(actions.register.registerRequest(data));
      } catch (err) {
        dispatch(actions.register.registerFailure());
      }
    },
    [data, dispatch]
  );
  useEffect(() => {
    if (loginSuccess.isLoggedIn === false) {
      setErrMessages(loginSuccess.err);
    } else if (loginSuccess.isLoggedIn === true) {
      localStorage.setItem("token", loginSuccess.token);
      window.location.href = "/";
    }
  }, [loginSuccess, navigate]);
  return (
    <>
      {
        errMessages && errMessages.length > 0 ? (
          errMessages && Array.isArray(errMessages) ? (
            <div className="alert-auth ">
              <div className={`uk-alert err`}>
                {errMessages.map((err) => (
                  <div>{err}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="alert-auth ">
              <div className={`uk-alert err`}>
                <div>{errMessages}</div>
              </div>
            </div>
          )
        ) : ""
      }
      <div className="register__container">
        <Link to="/" className="login__logo">
          <img
            src="/icons/singleLogo.png"
            alt=""
          />
        </Link>
        <div className="register">
          <form action="" className="login__form" method="POST">
            <input
              type="text"
              placeholder="Username"
              name="userName"
              className="login__form-input"
              value={data.userName}
              onChange={(e) => setData({ ...data, userName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Display Name"
              name="displayName"
              className="login__form-input"
              value={data.displayName}
              onChange={(e) =>
                setData({ ...data, displayName: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="login__form-input"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <input
              type="text"
              placeholder="Invite code"
              name="identification"
              className="login__form-input"
              value={data.adress}
              onChange={(e) => setData({ ...data, identification: e.target.value })}
            />
            {/* <input
              type="text"
              placeholder="..."
              name="identification"
              value={data.identification}
              onChange={(e) =>
                setData({ ...data, identification: e.target.value })
              }
              className="login__form-input"
            /> */}
            <button
              className="login__form-button"
              name="btnSubmit"
              type="submit"
              onClick={onSubmit}
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
