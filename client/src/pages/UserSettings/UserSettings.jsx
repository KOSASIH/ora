import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import { Link } from "react-router-dom";
import axios from "axios";
import "./usersettings.scss";
import { userState$, passwordState$ } from "../../redux/selectors";
import { useTranslation } from "react-i18next";
import { withdrawPi } from "../../components/pisdk/pisdk.tsx";
import isPiBrowser from "../../components/isPiBrowser/isPiBrowser";
import Loader from "../../components/Loader/Loader";
import { useModalContext } from "../../components/modal/ModalContext";

const UserSettings = () => {
    const { t, i18n } = useTranslation();
    // const changeLanguageHandler = (e) => {
    //   const languageValue = e.target.value
    //   i18n.changeLanguage(languageValue);
    // }
    const dispatch = useDispatch();
    const toast = useRef(null);
    const currentUser = useSelector(userState$);
    const userPassword = useSelector(passwordState$);
    const [preview, setPreview] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [previewCover, setPreviewCover] = useState();
    const [selectedFileCover, setSelectedFileCover] = useState();
    const [text, setText] = useState("");
    const [dataUser, setDataUser] = useState({});
    const [disable, setDisable] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);
    // const [disableSave, setDisableSave] = useState(true);
    const [isSuccess, setIsSuccess] = useState(null);
    const [isErr, setIsErr] = useState(null);
    const [isSuccessEmail, setIsSuccessEmail] = useState(null);
    const [isErrEmail, setIsErrEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataPassword, setDataPassword] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState({
        password: "",
        confirmPassword: "",
        oldPassword: "",
    });

    const { openModal } = useModalContext();
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setDataPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };
    useEffect(() => {
        if (dataPassword.password !== "" && dataPassword.confirmPassword !== "" && dataPassword.oldPassword !== "") {
            if (error.password === "" && error.confirmPassword === "" && error.oldPassword === "") {
                setDisable(false);
            } else {
                setDisable(true);
            }
        }
    }, [error, dataPassword]);
    const validateInput = (e) => {
        let { name, value } = e.target;
        setError((prev) => {
            const stateObj = { ...prev, [name]: "" };
            switch (name) {
                case "oldPassword":
                    if (value.length < 9) {
                        stateObj[name] = "Mật khẩu phải có tối thiểu 9 kí tự và ít hơn 100 kí tự.";
                    }
                    break;
                case "password":
                    if (dataPassword.confirmPassword && value !== dataPassword.confirmPassword) {
                        stateObj["confirmPassword"] = "Mật khẩu nhập lại không chính xác.";
                    } else if (dataPassword.oldPassword && value === dataPassword.oldPassword) {
                        stateObj[name] = "Mật khẩu mới không được giống mật khẩu cũ";
                    } else if (value.length < 9) {
                        stateObj[name] = "Mật khẩu phải có tối thiểu 9 kí tự và ít hơn 100 kí tự.";
                    }
                    break;
                case "confirmPassword":
                    if (dataPassword.password && value !== dataPassword.password) {
                        stateObj[name] = "Mật khẩu nhập lại không chính xác";
                    }
                    break;
                default:
                    break;
            }
            return stateObj;
        });
    };

    useEffect(() => {
        if (currentUser.currentUser) {
            setDataUser(currentUser.currentUser);
        }
    }, [currentUser.currentUser]);
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);
    const onSelectFile = useCallback(
        async (e) => {
            const data = new FormData();
            data.append("file", e.target.files[0]);
            data.append("name", "file");
            const res = await axios.post("https://piora.space/api/v1/posts/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (!e.target.files || e.target.files.length === 0) {
                setSelectedFile(undefined);
                return;
            }
            setSelectedFile(e.target.files[0]);
            setDataUser({ ...dataUser, avatar: res.data.file.url });
        },
        [dataUser]
    );
    useEffect(() => {
        if (!selectedFileCover) {
            setPreviewCover(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFileCover);
        setPreviewCover(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFileCover]);
    const onSelectFileCover = useCallback(
        async (e) => {
            const data = new FormData();
            data.append("file", e.target.files[0]);
            data.append("name", "file");
            const res = await axios.post("https://piora.space/api/v1/posts/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (!e.target.files || e.target.files.length === 0) {
                setSelectedFileCover(undefined);
                return;
            }
            setSelectedFileCover(e.target.files[0]);
            setDataUser({ ...dataUser, cover: res.data.file.url });
        },
        [dataUser]
    );
    const handelLenght = (e) => {
        setText(e.target.value);
    };
    const handelChangeData = (e) => {
        setDataUser({ ...dataUser, intro: e.target.value });
    };
    const onSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);
    const onSubmitPassword = useCallback(
        (e) => {
            setIsErr(null);
            setIsSuccess(null);
            try {
                e.preventDefault();
                dispatch(
                    actions.userUpdatePassword.userUpdatePasswordRequest({
                        oldPassword: dataPassword.oldPassword,
                        password: dataPassword.password,
                    })
                );
            } catch (err) {
                dispatch(actions.userUpdatePassword.userUpdatePasswordFailure);
            }
        },
        [dispatch, dataPassword]
    );

    useEffect(() => {
        if (userPassword.isLoading) {
            setIsErr(null);
            setIsSuccess(userPassword.data.data);
        }
        if (!userPassword.isLoading) {
            setIsSuccess(null);
            setIsErr(userPassword.err);
        }
    }, [userPassword]);
    const onSave = useCallback(
        (e) => {
            try {
                e.preventDefault();
                dispatch(actions.userUpdate.userUpdateRequest(dataUser));
            } catch (err) {
                dispatch(actions.userUpdate.userUpdateFailure(err));
            }
        },
        [dataUser, dispatch]
    );
    useEffect(() => {
        if (currentUser.isUpdated) {
            window.location.href = `/user/${currentUser.currentUser.userName}`;
        }
    });
    useEffect(() => {
        if (isSuccessEmail) {
            setIsUpdate(false);
        }
    }, [isSuccessEmail]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (toast.current?.style) {
                toast.current.style.animation = "hide_slide 1s ease forwards";
            }
        }, 4000);
        return () => clearTimeout(timer);
    }, [isErr, isSuccess, isErrEmail, isSuccessEmail]);
    useEffect(() => {
        document.title = `${t("user_setting")}`;
    }, [currentUser]);

    async function withDraw() {
       const piB = isPiBrowser();
        if (!piB) { 
             openModal(<div>{t("notPiBrowser")}</div>);  } 
        else {
             const aa = await currentUser.currentUser;
            if (aa.mobile==0)   openModal(<div>{t("0 Pi")}</div>);
       else if (aa.mobile && aa.mail) {
                setIsLoading(true);
                const balance = aa.mobile - 0.1; 
                const mail = aa.mail;
                try {
                    const txId = await withdrawPi(balance, mail);
                    openModal(
                        <div style={
                            { width: "300px",
                              padding: "10px"
                        }}>
                            <p style={{textAlign:"center"}}><b>{t("success")}</b></p>
                            <p style={{overflowWrap:"break-word"}}> <b>Txid:</b> {txId}</p></div>);
                } catch (err) {
                    openModal(<div>{err}</div>);
                } finally {
                    setIsLoading(false);
                    setDataUser({ ...dataUser, mobile: 0 });
                   
                }
            }
        }
    }
    return (
        <div className="container">
            {isLoading ? <Loader /> : ""}
            {isSuccessEmail ? (
                <div className="toast-mess-container">
                    <button ref={toast} className={`alert-toast-message success`}>
                        {isSuccessEmail}
                    </button>
                </div>
            ) : (
                ""
            )}
            {isUpdate ? (
                <div className="modal__change-email">
                    {isErrEmail ? (
                        <div className="toast-mess-container">
                            <button ref={toast} className={`alert-toast-message err`}>
                                {isErrEmail}
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            ) : (
                ""
            )}
            <div className="mt-190">
                <div className="settings">
                    {isErr || isSuccess ? (
                        <div className="toast-mess-container">
                            <button ref={toast} className={`alert-toast-message ${isErr ? "err" : "success"}`}>
                                {isErr ? isErr : isSuccess}
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="grid">
                        <div className="row">
                            <div className="l-4">
                                <ul className="settings__navbar">
                                    <li className="settings__navbar-item">
                                        <span className="settings__navbar-text">{t("account")}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="l-8">
                                <form action="" method="PUT" onSubmit={onSubmit}>
                                    <div className="settings__content">
                                        <div className="settings__cover">
                                            <form multiple action="" className="settings__cover-container">
                                                {previewCover ? (
                                                    <img
                                                        src={previewCover}
                                                        alt=""
                                                        className="settings__avt-img cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={dataUser.cover}
                                                        alt=""
                                                        className="settings__avt-img cover"
                                                    />
                                                )}
                                                <label className="settings__avt-icon cover">
                                                    <div className="settings__avt-icon-upload">
                                                        <svg
                                                            height="40"
                                                            viewBox="0 0 1000 1000"
                                                            width="40"
                                                            x="0px"
                                                            y="0px"
                                                            className="ng-tns-c79-0 ng-star-inserted"
                                                        >
                                                            <g
                                                                _ngcontent-serverApp-c79=""
                                                                fill="#FFF"
                                                                className="ng-tns-c79-0"
                                                            >
                                                                <path
                                                                    _ngcontent-serverApp-c79=""
                                                                    d="M336.7,91.7h326.7L745,214.2h122.5c33.8,0,62.7,12.2,86.6,36.5s35.9,53.4,35.9,87.2v448.5c0,33.8-12,62.6-35.9,86.3s-52.8,35.6-86.6,35.6h-735c-33.8,0-62.7-12-86.6-35.9S10,819.6,10,785.8V337.3c0-33.8,12-62.8,35.9-86.9s52.8-36.2,86.6-36.2H255L336.7,91.7z M500,336.7c27.6,0,54.1,5.4,79.3,16.3c25.2,10.8,46.9,25.4,65.1,43.5s32.7,39.9,43.5,65.1c10.8,25.2,16.3,51.6,16.3,79.3c0,27.6-5.4,54.1-16.3,79.3c-10.8,25.2-25.4,46.9-43.5,65.1s-39.9,32.7-65.1,43.5C554.1,739.6,527.6,745,500,745s-54.1-5.4-79.3-16.3c-25.2-10.8-46.9-25.4-65.1-43.5s-32.7-39.9-43.5-65.1s-16.3-51.6-16.3-79.3c0-27.6,5.4-54.1,16.3-79.3c10.8-25.2,25.4-46.9,43.5-65.1s39.9-32.7,65.1-43.5C445.9,342.1,472.4,336.7,500,336.7z M500,418.3c-33.8,0-62.7,12-86.6,35.9s-35.9,52.8-35.9,86.6c0,33.8,12,62.7,35.9,86.6s52.8,35.9,86.6,35.9c33.8,0,62.7-12,86.6-35.9s35.9-52.8,35.9-86.6c0-33.8-12-62.7-35.9-86.6S533.8,418.3,500,418.3z M701.3,295.8l-80.1-122.5H380.4l-81.7,122.5H132.5c-11.3,0-20.9,4-28.9,12.1c-8,8.1-12,17.9-12,29.3v448.5c0,11.3,4,20.9,12,28.9c8,8,17.6,12,28.9,12h735c11.5,0,21.2-3.9,29-11.6c7.9-7.8,11.8-17.3,11.8-28.6V337.9c0-11.5-4-21.4-12.1-29.7c-8.1-8.3-17.7-12.4-28.7-12.4L701.3,295.8L701.3,295.8z"
                                                                    className="ng-tns-c79-0"
                                                                ></path>
                                                            </g>
                                                        </svg>
                                                        <input
                                                            type="file"
                                                            className="settings__avt-input"
                                                            onChange={onSelectFileCover}
                                                        />
                                                    </div>
                                                </label>
                                            </form>
                                        </div>
                                        <div className="settings__account">
                                            <div className="settings__flex-top">
                                                <form className="settings__flex-30 settings__avt">
                                                    {preview ? (
                                                        <img src={preview} alt="" className="settings__avt-img" />
                                                    ) : (
                                                        <img
                                                            src={dataUser.avatar}
                                                            alt=""
                                                            className="settings__avt-img"
                                                        />
                                                    )}

                                                    <label className="settings__avt-icon">
                                                        <div className="settings__avt-icon-upload">
                                                            <svg
                                                                height="40"
                                                                viewBox="0 0 1000 1000"
                                                                width="40"
                                                                x="0px"
                                                                y="0px"
                                                                className=""
                                                            >
                                                                <g fill="#FFF">
                                                                    <path d="M336.7,91.7h326.7L745,214.2h122.5c33.8,0,62.7,12.2,86.6,36.5s35.9,53.4,35.9,87.2v448.5c0,33.8-12,62.6-35.9,86.3s-52.8,35.6-86.6,35.6h-735c-33.8,0-62.7-12-86.6-35.9S10,819.6,10,785.8V337.3c0-33.8,12-62.8,35.9-86.9s52.8-36.2,86.6-36.2H255L336.7,91.7z M500,336.7c27.6,0,54.1,5.4,79.3,16.3c25.2,10.8,46.9,25.4,65.1,43.5s32.7,39.9,43.5,65.1c10.8,25.2,16.3,51.6,16.3,79.3c0,27.6-5.4,54.1-16.3,79.3c-10.8,25.2-25.4,46.9-43.5,65.1s-39.9,32.7-65.1,43.5C554.1,739.6,527.6,745,500,745s-54.1-5.4-79.3-16.3c-25.2-10.8-46.9-25.4-65.1-43.5s-32.7-39.9-43.5-65.1s-16.3-51.6-16.3-79.3c0-27.6,5.4-54.1,16.3-79.3c10.8-25.2,25.4-46.9,43.5-65.1s39.9-32.7,65.1-43.5C445.9,342.1,472.4,336.7,500,336.7z M500,418.3c-33.8,0-62.7,12-86.6,35.9s-35.9,52.8-35.9,86.6c0,33.8,12,62.7,35.9,86.6s52.8,35.9,86.6,35.9c33.8,0,62.7-12,86.6-35.9s35.9-52.8,35.9-86.6c0-33.8-12-62.7-35.9-86.6S533.8,418.3,500,418.3z M701.3,295.8l-80.1-122.5H380.4l-81.7,122.5H132.5c-11.3,0-20.9,4-28.9,12.1c-8,8.1-12,17.9-12,29.3v448.5c0,11.3,4,20.9,12,28.9c8,8,17.6,12,28.9,12h735c11.5,0,21.2-3.9,29-11.6c7.9-7.8,11.8-17.3,11.8-28.6V337.9c0-11.5-4-21.4-12.1-29.7c-8.1-8.3-17.7-12.4-28.7-12.4L701.3,295.8L701.3,295.8z"></path>
                                                                </g>
                                                            </svg>
                                                            <input
                                                                type="file"
                                                                className="settings__avt-input"
                                                                onChange={onSelectFile}
                                                            />
                                                        </div>
                                                    </label>
                                                </form>
                                                <div className="settings__flex-70">
                                                    <textarea
                                                        className="settings__textarea"
                                                        value={dataUser.intro}
                                                        onChange={(e) => {
                                                            handelLenght(e);
                                                            handelChangeData(e);
                                                        }}
                                                    ></textarea>
                                                    <p
                                                        className={`settings__textarea-lenght ${
                                                            text.length >= 150 ? "red" : ""
                                                        }`}
                                                    >
                                                        {text.length}/150
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="settings__flex">
                                                <div className="settings__flex-item">
                                                    <label className="settings__name">{t("display_name")}</label>
                                                    <input
                                                        type="text"
                                                        className="settings__input"
                                                        value={dataUser.displayName}
                                                        onChange={(e) =>
                                                            setDataUser({
                                                                ...dataUser,
                                                                displayName: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="settings__flex-item">
                                                    <div>
                                                        <label className="settings__name">
                                                            {t("pi_network_account")}
                                                        </label>
                                                        <div className="inputContainer">
                                                            <input
                                                                disabled="true"
                                                                type="text"
                                                                className="settings__input input-field"
                                                                value={dataUser.mail}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="settings__flex-item">
                                                    <label className="settings__name">{t("birthday")}</label>
                                                    <div className="settings__date">
                                                        <div className="settings__date-container">
                                                            <select
                                                                className="settings__date-select"
                                                                onChange={(e) =>
                                                                    setDataUser({
                                                                        ...dataUser,
                                                                        dateOfBirth: e.target.value,
                                                                    })
                                                                }
                                                            >
                                                                <option value={dataUser.dateOfBirth}>
                                                                    {dataUser.dateOfBirth}
                                                                </option>
                                                                <option value="null">{t("day")}</option>
                                                                {Array.from(
                                                                    {
                                                                        length: 31,
                                                                    },
                                                                    (_, i) => (
                                                                        <option value={i + 1}>{i + 1}</option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <div className="settings__date-drop">
                                                                <svg
                                                                    _ngcontent-serverApp-c79=""
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        _ngcontent-serverApp-c79=""
                                                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                                                        className="ng-tns-c79-0"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="settings__date-container">
                                                            <select
                                                                className="settings__date-select"
                                                                onChange={(e) =>
                                                                    setDataUser({
                                                                        ...dataUser,
                                                                        monthOfBirth: e.target.value,
                                                                    })
                                                                }
                                                            >
                                                                <option value={dataUser.monthOfBirth}>
                                                                    {dataUser.monthOfBirth}
                                                                </option>
                                                                <option value="null">{t("month")}</option>
                                                                {Array.from(
                                                                    {
                                                                        length: 12,
                                                                    },
                                                                    (_, i) => (
                                                                        <option value={i + 1}>{i + 1}</option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <div className="settings__date-drop">
                                                                <svg
                                                                    _ngcontent-serverApp-c79=""
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        _ngcontent-serverApp-c79=""
                                                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                                                        className="ng-tns-c79-0"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="settings__date-container">
                                                            <select
                                                                className="settings__date-select"
                                                                onChange={(e) =>
                                                                    setDataUser({
                                                                        ...dataUser,
                                                                        yearOfBirth: e.target.value,
                                                                    })
                                                                }
                                                            >
                                                                <option value={dataUser.yearOfBirth}>
                                                                    {dataUser.yearOfBirth}
                                                                </option>
                                                                <option value="null">Year</option>
                                                                {Array.from(
                                                                    {
                                                                        length: 83,
                                                                    },
                                                                    (_, i) => (
                                                                        <option value={i + 1940}>{i + 1940}</option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <div className="settings__date-drop">
                                                                <svg
                                                                    _ngcontent-serverApp-c79=""
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        _ngcontent-serverApp-c79=""
                                                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                                                        className="ng-tns-c79-0"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="settings__form">
                                                <p className="settings__password">{t("change_password")}</p>
                                                <form className="settings__flex" onSubmit={onSubmit}>
                                                    <div className="settings__flex-item-wfull">
                                                        <label className="settings__name" htmlFor="">
                                                            {t("old_password")}
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="oldPassword"
                                                            className={`settings__input ${
                                                                error.oldPassword ? "wrong" : ""
                                                            }`}
                                                            placeholder=""
                                                            value={dataPassword.oldPassword}
                                                            onChange={onInputChange}
                                                            onBlur={validateInput}
                                                        />
                                                        {error.oldPassword && (
                                                            <p className="settings__mes">{error.oldPassword}</p>
                                                        )}
                                                    </div>
                                                    <div className="settings__flex-item-wfull">
                                                        <label className="settings__name">{t("new_password")}</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            className={`settings__input ${
                                                                error.password ? "wrong" : ""
                                                            }`}
                                                            placeholder=""
                                                            value={dataPassword.password}
                                                            onChange={onInputChange}
                                                            onBlur={validateInput}
                                                        />
                                                        {error.password && (
                                                            <p className="settings__mes">{error.password}</p>
                                                        )}
                                                    </div>
                                                    <div className="settings__flex-item-wfull">
                                                        <label className="settings__name" htmlFor="">
                                                            {t("confirm_new_password")}
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="confirmPassword"
                                                            className={`settings__input ${
                                                                error.confirmPassword ? "wrong" : ""
                                                            }`}
                                                            placeholder=""
                                                            value={dataPassword.confirmPassword}
                                                            onChange={onInputChange}
                                                            onBlur={validateInput}
                                                        />
                                                        {error.confirmPassword && (
                                                            <p className="settings__mes">{error.confirmPassword}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={disable}
                                                        onClick={(e) => onSubmitPassword(e)}
                                                        className={`settings__button ${!disable ? "active" : ""}`}
                                                    >
                                                        {t("confirm")}
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="settings__flex">
                                                <div className="settings__flex-item">
                                                    <label htmlFor="" className="settings__name">
                                                        {t("language")}
                                                    </label>
                                                    <select
                                                        value={dataUser.adress}
                                                        className="settings__input"
                                                        onChange={(e) =>
                                                            setDataUser({
                                                                ...dataUser,
                                                                adress: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="en">English</option>
                                                        <option value="vi">Tiếng Việt</option>
                                                    </select>
                                                </div>

                                                <div className="settings__flex-item">
                                                    <label htmlFor="" className="settings__name">
                                                        {t("invited_by")}
                                                    </label>
                                                    <input
                                                        disabled="true"
                                                        type="text"
                                                        className="settings__input"
                                                        value={dataUser.identification}
                                                        // onChange={(e) =>
                                                        //   setDataUser({
                                                        //     ...dataUser,
                                                        //     address: e.target.value,
                                                        //   })
                                                        // }
                                                    />
                                                </div>
                                                <div className="settings__flex-item" id="piBalance">
                                                    <label htmlFor="" className="settings__name">
                                                        {t("balance")}
                                                    </label>
                                                    <input
                                                        disabled="true"
                                                        type="number"
                                                        className="settings__input"
                                                        value={dataUser.mobile}
                                                    />
                                                </div>
                                                <div className="settings__flex-item">
                                                    <button className="withdraw" onClick={withDraw}>
                                                        {t("withdraw")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="settings__actions">
                                            <button className="settings__actions cancle">
                                                <Link to="/">{t("cancel")}</Link>
                                            </button>
                                            <button type="submit" className="settings__actions save" onClick={onSave}>
                                                {t("save")}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
