import React, { useState, useCallback, useEffect } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import { userState$ } from "../../redux/selectors";
import { Pisdk } from "../../components/pisdk/pisdk.tsx";
import { useTranslation } from "react-i18next";
import isPiBrowser from "../../components/isPiBrowser/isPiBrowser";
const Login = () => {
    const [data, setData] = useState({ userName: "", password: "" });
    const [errMessage, setErrMessage] = useState(null);
    const piB = isPiBrowser();
    const loginSuccess = useSelector(userState$);

    const { t } = useTranslation();

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = useCallback(
        (e) => {
            try {
                e.preventDefault();
                dispatch(actions.login.loginRequest(data));
            } catch (err) {
                dispatch(actions.login.loginFailure());
            }
        },
        [dispatch, data]
    );

    const Pilogin = useCallback(async (e) => {
        try {
            e.preventDefault();
            const userPi = await Pisdk();

            if (userPi) {
                dispatch(actions.login.loginPiRequest({ piUser: userPi.username, accessToken: userPi.uid }));
            }
        } catch (err) {
            dispatch(actions.login.loginFailure());
        }
    }, []);

    useEffect(() => {
        if (!loginSuccess.isLoggedIn) {
            setErrMessage(loginSuccess.err);
        }
    }, [loginSuccess]);
    useEffect(() => {
        if (loginSuccess.token) {
            localStorage.setItem("token", loginSuccess.token);
        } else {
            localStorage.removeItem("token");
        }
    }, [loginSuccess]);
    useEffect(() => {
        if (loginSuccess.currentUser) {
            window.location.href = "/";
        }
    }, [navigate, loginSuccess]);

    return (
        <div className="login">
            <div className="login__container">
                <Link to="/" className="login__logo">
                    <img src="/icons/singleLogo.png" alt="" />
                </Link>
                <p>{errMessage}</p>
                {!piB ? (
                    <form action="" method="POST" className="login__form">
                        <input
                            type="text"
                            placeholder={t("username")}
                            name="userName"
                            className="login__form-input"
                            value={data.userName}
                            onChange={(e) => setData({ ...data, userName: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder={t("password")}
                            name="password"
                            className="login__form-input"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        <button className="login__form-button" type="submit" onClick={onSubmit}>
                            {t("login")}
                        </button>
                    </form>
                ) : (
                    <form className="login__form">
                        <p className="auth__logging-tilte">{t("or_login_with_pi_browser")}</p>
                        <div className="">
                            <button className="login__form-button" type="submit" value="Xác nhận" onClick={Pilogin}>
                                {t("auth_with_pi_browser")}
                            </button>
                        </div>
                    </form>
                )}

                {/* <Link to="/">
                    <p className="login__text link">{t("forgot_password")}</p>
                </Link> */}
                <span className="login__text">{t("do_not_have_piora_account")}</span>
                <Link to="/register">
                    <span className="login__text link"> {t("sign_up_now")}</span>
                </Link>
            </div>
        </div>
    );
};
export default Login;
