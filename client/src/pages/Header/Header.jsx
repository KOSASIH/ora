import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { userState$, categoriesState$ } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as actions from "../../redux/actions";
import "./header.scss";
import Notifications from "../../components/Notifications/Notifications";
import { useTranslation } from "react-i18next";
const Header = () => {
  const listRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const notiId = searchParams.get('notiId')
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(userState$);
  const categorise = useSelector(categoriesState$);
  const [visible, setVisible] = useState(true);
  const [headerPost, setHeaderPost] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [countNotiMes, setCountNotiMes] = useState(0);
  const [showDropDown, setShowDropDown] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [query, setQuery] = useState(null);
  const [countNotifications, setCountNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (listRef.current) {
      const slider = listRef.current;
      let isDown = false;
      let startX;
      let scrollLeft;
      slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });
      slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
      });
      slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
      });
      slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1;
        slider.scrollLeft = scrollLeft - walk;
      });
    }
  }, []);
  const getCategories = useCallback(() => {
    dispatch(actions.getAllCategories.getAllCategoriesRequest());
  }, [dispatch]);
  useEffect(() => {
    
    getCategories();
  }, [getCategories]);
  const checkCurrentUser = useCallback(() => {
    dispatch(actions.checkCurrentUser.checkCurrentUserRequest());
  }, [dispatch]);
  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);
  const handleShow = () => setShowCategory(!showCategory);
  const handleShowNotify = () => setShowNotify(!showNotify);
  const handleShowDropDown = () => setShowDropDown(!showDropDown);
  const getAllNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const option = {
          method: "get",
          url: `/api/v1/notifications/`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const res = await axios(option);
        setNotifications(res.data.data);
      } catch (err) {}
    }
  }, []);
  useEffect(() => {
    getAllNotifications();
  }, [getAllNotifications]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 350 || window.pageYOffset > 120) {
        setVisible(false);
        setHeaderPost(false);
      } else {
        setVisible(true);
        setHeaderPost(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleClickWindow = () => {
      setShowCategory(false);
      setShowNotify(false);
      setShowDropDown(false);
    };
    document.body.addEventListener("click", handleClickWindow, true);
    return () => {
      document.body.removeEventListener("click", handleClickWindow, true);
    };
  }, []);
  const cls = visible ? "visible" : "hide";
  const cls2 = headerPost ? "visible" : "hide";
  const headerDropDown = [
    {
      icon: (
        <svg
          _ngcontent-serverapp-c41=""
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          height="18"
          width="18"
        >
          <path
            _ngcontent-serverapp-c41=""
            d="M109.38,62.5A47.11,47.11,0,0,0,62.5,109.38V390.63a47.11,47.11,0,0,0,46.88,46.87H307.29a15.62,15.62,0,0,0,11-4.58l.16-.16L432.92,318.34a15.62,15.62,0,0,0,4.58-11V109.38A47.11,47.11,0,0,0,390.63,62.5Zm0,31.25H390.63a15.39,15.39,0,0,1,15.62,15.63V291.67H338.54a47.11,47.11,0,0,0-46.87,46.87v67.71H109.38a15.39,15.39,0,0,1-15.63-15.62V109.38A15.4,15.4,0,0,1,109.38,93.75Zm52.08,52.06a15.63,15.63,0,1,0-.44,31.25H338.54a15.63,15.63,0,1,0,.44-31.25H161.46Zm0,72.92A15.63,15.63,0,1,0,161,250H296.88a15.63,15.63,0,0,0,.44-31.25H161.46ZM338.54,322.92h45.62l-61.24,61.24V338.54A15.38,15.38,0,0,1,338.54,322.92Z"
            className="cls-1"
          ></path>
        </svg>
      ),
      displayName: "Your Posts",
      path: "/",
    },
    {
      icon: (
        <svg
          _ngcontent-serverapp-c41=""
          width="18"
          height="19"
          viewBox="0 0 18 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            _ngcontent-serverapp-c41=""
            d="M15.75 0.25H2.25C0.984375 0.25 0 1.26953 0 2.5V12.625C0 13.8906 0.984375 14.875 2.25 14.875H5.625V17.8281C5.625 18.1094 5.80078 18.25 6.04688 18.25C6.11719 18.25 6.1875 18.25 6.29297 18.1797L10.6875 14.875H15.75C16.9805 14.875 18 13.8906 18 12.625V2.5C18 1.26953 16.9805 0.25 15.75 0.25ZM16.3125 12.625C16.3125 12.9414 16.0312 13.1875 15.75 13.1875H10.125L9.66797 13.5391L7.3125 15.2969V13.1875H2.25C1.93359 13.1875 1.6875 12.9414 1.6875 12.625V2.5C1.6875 2.21875 1.93359 1.9375 2.25 1.9375H15.75C16.0312 1.9375 16.3125 2.21875 16.3125 2.5V12.625Z"
            className="cls-1"
          ></path>
        </svg>
      ),
      displayName: "Your Comments",
      path: "/",
    },
    {
      icon: (
        <svg
          _ngcontent-serverapp-c41=""
          id="Layer_1"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          data-name="Layer 1"
          xmlns="www.w3.org/2000/svg"
        >
          <path
            _ngcontent-serverapp-c41=""
            d="M9.02 12.75V13.48H2V6.46997H2.95L3.2 5.17997C3.26 4.80997 2.98 4.46997 2.6 4.46997H0.6C0.27 4.46997 0 4.73997 0 5.06997V14.89C0 15.22 0.27 15.49 0.6 15.49H10.42C10.75 15.49 11.02 15.22 11.02 14.89V13.64C11.02 13.35 10.82 13.1 10.53 13.05L9.02 12.75Z"
            className="cls-1"
          ></path>
          <path
            _ngcontent-serverapp-c41=""
            d="M13.36 12.68L3.71995 10.83C3.38995 10.77 3.17995 10.45 3.23995 10.13L5.08995 0.489972C5.14995 0.159972 5.46995 -0.0500282 5.78995 0.00997178L15.43 1.85997C15.76 1.91997 15.97 2.23997 15.91 2.55997L14.06 12.2C14 12.53 13.68 12.74 13.36 12.68ZM5.46995 9.12997L12.36 10.45L13.68 3.55997L6.78995 2.23997L5.46995 9.12997Z"
            className="cls-1"
          ></path>
          <path
            _ngcontent-serverapp-c41=""
            d="M12.1 6.03989C12.08 6.03989 12.05 6.03989 12.03 6.02989L7.33003 5.11989C7.13003 5.07989 6.99003 4.87989 7.03003 4.67989C7.07003 4.47989 7.26003 4.33989 7.47003 4.37989L12.17 5.28989C12.37 5.32989 12.51 5.52989 12.47 5.72989C12.44 5.90989 12.28 6.03989 12.1 6.03989Z"
            className="cls-1"
          ></path>
          <path
            _ngcontent-serverapp-c41=""
            d="M10.22 8.19006C10.2 8.19006 10.17 8.19006 10.15 8.18006L6.84004 7.55006C6.64004 7.51006 6.50004 7.31006 6.54004 7.11006C6.58004 6.91006 6.77004 6.77006 6.98004 6.81006L10.29 7.45006C10.49 7.49006 10.63 7.69006 10.59 7.89006C10.55 8.07006 10.39 8.19006 10.22 8.19006Z"
            className="cls-1"
          ></path>
        </svg>
      ),
      displayName: "Your Drafts",
      path: "/",
    },
  ];
  useEffect(() => {
    const handlePress = (e) => {
      if (inputRef.current) {
        if (e.keyCode === 13) {
          setIsSearch(false);
          setQuery(null);
          navigate(`/search?q=${query}&type=post`);
        }
      }
    };
    window.addEventListener("keypress", handlePress);
    return () => {
      window.removeEventListener("keypress", handlePress);
    };
  }, [navigate, query]);
  const onSubmitSearch = () => {
    setIsSearch(false);
    setQuery(null);
    navigate(`/search?q=${query}&type=post`);
  };
  useEffect(() => {
    if (notifications.length > 0) {
      setCountNotifications(
        notifications.filter((x) => {
          return x.isRead === false;
        }).length
      );
    }
  }, [notifications, countNotifications]);
  useEffect(() => { 
    if(notiId){
      getAllNotifications()
    }
  },[notiId,getAllNotifications])
  const getNotificationsMessage = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const option = {
          method: "get",
          url: `/api/v1/notimes`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const res = await axios(option);
        setCountNotiMes(res.data.data.count);
      } catch (err) {}
    }
  }, []);
  useEffect(() => {
    getNotificationsMessage();
  }, [getNotificationsMessage]);
  return location.pathname !== "/category" ? (
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/messages" &&
    location.pathname !== `/tao-tai-khoan` ? (
      location.pathname !== "/post/create/" &&
      location.pathname !== `/post/update/${path}` ? (
        <header className={`header ${visible ? "" : "header-height"}`}>
          <div className={`header__container ${cls} `}>
            {isSearch ? (
              <div className="header__search">
                <button
                  className="header__search-btn-cancel"
                  onClick={() => setIsSearch(false)}
                ></button>
                <div className="header__search-bar">
                  <input
                    ref={inputRef}
                    className="header__search-input"
                    type="text"
                    placeholder="Keyword"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <i
                    onClick={onSubmitSearch}
                    className="header__search-icon bx bx-search"
                  ></i>
                </div>
              </div>
            ) : (
              <div className="header__top">
                <div>
                  <Link to="/">
                    <img
                      src="/icons/wideLogo.png"
                      alt=""
                      width="180px"
                    />
                  </Link>
                </div>
                <div>
                  {currentUser.currentUser ? (
                    <ul className="header__menu-top">
                      <li>
                        <div
                          className="header__icon-top-wrapper"
                          onClick={() => setIsSearch(true)}
                        >
                          <i className="header__icon header__icon-top bx bx-search-alt-2"></i>
                        </div>
                      </li>
                      <li>
                        <Link to="/messages">
                          <button className="icon-notify">
                            {countNotiMes === 0 ? (
                              <i className="header__icon header__icon-top bx bxl-messenger"></i>
                            ) : (
                              <>
                                <i className="header__icon header__icon-top bx bxl-messenger"></i>
                                <span className="badge">{countNotiMes}</span>
                              </>
                            )}
                          </button>
                        </Link>
                      </li>
                      <li
                        className="header__icon-top-wrapper"
                        onClick={handleShowNotify}
                      >
                        <button className="icon-notify">
                          <i className=" header__icon header__icon-top bx bx-bell"></i>
                          {countNotifications === 0 ? (
                            ""
                          ) : (
                            <span className="badge">{countNotifications}</span>
                          )}
                        </button>
                        {showNotify && (
                          <div className="header__notify">
                            <div className="header__notify-container">
                              <header className="header__notify-header">
                                <h3>Notification</h3>
                              </header>
                              <div className="header__notify-wrapper">
                                <ul className="header__notify-list">
                                  {notifications.length !== 0
                                    ? notifications.map((notification) => (
                                        <Notifications
                                          notification={notification}
                                          key={notification._id}
                                        />
                                      ))
                                    : "Không có gì xem ở đây cả"}
                                </ul>
                              </div>
                              <footer className="header__notify-footer">
                                <p>More</p>
                              </footer>
                            </div>
                          </div>
                        )}
                      </li>
                      <li>
                        <div
                          className="header__avt"
                          onClick={handleShowDropDown}
                        >
                          <img
                            src={
                              currentUser.currentUser.avatar
                                ? `https://${currentUser.currentUser.avatar.slice(7)}`
                                : "/icons/avatar.png"
                            }
                            alt=""
                            className="post-avt2"
                            id="headAvt"
                          />
                        </div>
                        {showDropDown && (
                          <div className="header__dropdown">
                            <header className="p-10 border-bottom">
                              <Link
                                to={`user/${currentUser.currentUser.userName}`}
                                className="header__dropdown-header p-10 "
                              >
                                <div div className="header__dropdown-img">
                                  <img
                                    src={
                                      currentUser.currentUser.avatar
                                        ? `https://${currentUser.currentUser.avatar.slice(7)}`
                                        : "/icons/avatar.png"
                                    }
                                    alt=""
                                  />
                                </div>
                                <div className="header__dropdown-info">
                                  <p className="header__dropdown-name">
                                    {currentUser.currentUser.displayName
                                      ? currentUser.currentUser.displayName
                                      : currentUser.currentUser.userName}
                                  </p>
                                  <span className="header__dropdown-phone">
                                    @
                                    {currentUser.currentUser.mobile
                                      ? currentUser.currentUser.mobile
                                      : currentUser.currentUser.userName}
                                  </span>
                                </div>
                              </Link>
                            </header>
                            <div className="header__dropdown-content">
                              <div className="p-7 border-bottom">
                                <ul className="header__dropdown-list ">
                                  {headerDropDown.map((e, i) => (
                                    <li
                                      key={i}
                                      className="header__dropdown-item p-13"
                                    >
                                      <Link
                                        to={e.path}
                                        className="header__dropdown-link"
                                      >
                                        <i className="header__dropdown-icon">
                                          {e.icon}
                                        </i>
                                        <p className="header__dropdown-text">
                                          {e.displayName}
                                        </p>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="header__dropdown-config border-bottom">
                                <div className="p-10">
                                  <Link
                                    to="/user/settings"
                                    className="header__dropdown-link p-10"
                                  >
                                    <i className="header__dropdown-icon">
                                      <svg
                                        _ngcontent-serverapp-c41=""
                                        id="Layer_1"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        data-name="Layer 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          _ngcontent-serverapp-c41=""
                                          d="M15.7218 5.84C15.1018 5.83 14.4918 5.56 14.0718 5.03C13.4918 4.28 13.4718 3.26 13.9418 2.49C12.8418 1.22 11.4318 0.38 9.91181 0C9.78181 0.29 9.5918 0.56 9.3318 0.77C8.4218 1.53 7.08181 1.38 6.34181 0.439999C6.23181 0.299999 6.1518 0.15 6.0818 0C4.9818 0.28 3.92181 0.79 2.98181 1.57C2.67181 1.83 2.3918 2.11 2.1318 2.4C2.7718 3.34 2.61181 4.64 1.73181 5.36C1.31181 5.71 0.791801 5.86 0.281801 5.83C-0.108199 7.32 -0.0981935 8.9 0.341807 10.39C0.981807 10.37 1.62181 10.64 2.05181 11.19C2.63181 11.93 2.6618 12.93 2.2118 13.7C3.2818 14.86 4.62181 15.63 6.05181 16C6.18181 15.67 6.3818 15.38 6.6718 15.14C7.5818 14.38 8.92181 14.53 9.66181 15.48C9.78181 15.64 9.88181 15.82 9.95181 16C11.0418 15.72 12.0918 15.21 13.0218 14.44C13.3318 14.18 13.6018 13.9 13.8618 13.61C13.3818 12.7 13.5818 11.53 14.4018 10.86C14.7718 10.55 15.2218 10.4 15.6618 10.39C16.0918 8.91 16.1218 7.33 15.7218 5.84ZM8.0018 11.53C6.0518 11.53 4.4718 9.95 4.4718 8C4.4718 6.05 6.0518 4.47 8.0018 4.47C9.9518 4.47 11.5318 6.05 11.5318 8C11.5318 9.95 9.9518 11.53 8.0018 11.53Z"
                                          className="cls-1"
                                        ></path>
                                      </svg>
                                    </i>
                                    <p className="header__dropdown-text">
                                     Setting
                                    </p>
                                  </Link>
                                </div>
                              </div>
                              <div className="header__dropdown-logout">
                                <div className="p-10">
                                  <Link
                                    to="/login"
                                    className="header__dropdown-link p-10 "
                                  >
                                    <i className="header__dropdown-icon">
                                      <svg
                                        _ngcontent-serverapp-c41=""
                                        id="Layer_1"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        data-name="Layer 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          _ngcontent-serverapp-c41=""
                                          d="M14.4399 8.8501H5.88989C5.33989 8.8501 4.88989 8.4001 4.88989 7.8501C4.88989 7.3001 5.33989 6.8501 5.88989 6.8501H14.4399C14.9899 6.8501 15.4399 7.3001 15.4399 7.8501C15.4399 8.4001 14.9999 8.8501 14.4399 8.8501Z"
                                          className="cls-1"
                                        ></path>
                                        <path
                                          _ngcontent-serverapp-c41=""
                                          d="M10.5299 13.1C10.2799 13.1 10.0299 13.01 9.83992 12.82C9.43992 12.44 9.42992 11.8 9.80992 11.4L13.1399 7.91996L9.82992 4.60996C9.43992 4.21996 9.43992 3.57996 9.82992 3.18996C10.2199 2.79996 10.8599 2.79996 11.2499 3.18996L15.0699 7.00996C15.5599 7.48996 15.5699 8.29996 15.0899 8.79996L11.2699 12.79C11.0599 12.99 10.7999 13.1 10.5299 13.1ZM13.6399 8.41996C13.6399 8.41996 13.6399 8.42996 13.6399 8.41996V8.41996Z"
                                          className="cls-1"
                                        ></path>
                                        <path
                                          _ngcontent-serverapp-c41=""
                                          d="M5.79 16H1C0.45 16 0 15.55 0 15V1C0 0.45 0.45 0 1 0H5.79C6.34 0 6.79 0.45 6.79 1C6.79 1.55 6.34 2 5.79 2H2V13.99H5.78C6.33 13.99 6.78 14.44 6.78 14.99C6.79 15.55 6.34 16 5.79 16Z"
                                          className="cls-1"
                                        ></path>
                                      </svg>
                                    </i>
                                   Logout
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                      <li>
                        <Link to="post/create/">
                          <button className="header__button">{t('new_post')}</button>
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <ul className="header__menu-top">
                      <li>
                        <div
                          className="header__icon-top-wrapper"
                          onClick={() => setIsSearch(true)}
                        >
                          <i className="header__icon header__icon-top bx bx-search-alt-2"></i>
                        </div>
                      </li>
                      <li>
                        <Link to="/login">
                          <button className="header__button">Login</button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}
            <div className="header__menu">
              <div className="header__cate" onClick={handleShow}>
                <span className="header__title no-wrap">FOLLOWING</span>
                <i className="header__icon bx bx-chevron-down"></i>
                {showCategory && (
                  <div className="header__cate-menu">
                    {currentUser.currentUser ? (
                      currentUser.currentUser.category.length !== 0 ? (
                        currentUser.currentUser.category.map((e, i) => (
                          <div className="header__cate-list">
                            <Link to={`/category/${e.slug}`}>
                              <div className="header__cate-link">
                                <img
                                  className="header__cate-img"
                                  src={e.attachment}
                                  alt=""
                                />
                                <span className="header__cate-text">
                                  {e.name}
                                </span>
                              </div>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <Link to="/category">
                          <div className="header__cate-link">
                            <span className="header__cate-text">
                              Nothing
                            </span>
                          </div>
                        </Link>
                      )
                    ) : (
                      <Link to="/category">
                        <div className="header__cate-link">
                          <span className="header__cate-text">
                            Nothing
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div className="header__member">
                {/* <Link to="/" className="header__title no-wrap">
                  THÀNH VIÊN NỔI BẬT
                </Link> */}
              </div>
              <div className="header__menu-category">
                <div className="header__menu-category-wrapper">
                  <div className="header__menu-category-icon left">
                    <i className=" header__icon bx bx-chevron-left"></i>
                  </div>
                  <div className="header__menu-navbar">
                    <ul className="header__menu-list" ref={listRef}>
                      {categorise.data.map((e, i) => (
                        <li key={i._id} className="header__menu-item">
                          <Link
                            to={`/category/${e.slug}`}
                            className="header__menu-link"
                          >
                            {e.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="header__menu-category-icon right">
                    <i className="header__icon bx bx-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header className={`header__post`}>
          <div className={`header__post-section ${cls2} `}>
            <div className="header__post-container">
              <div className="header__post-logo">
                <Link to="/">
                  <img
                    src="icons/wideLogo.png"
                    alt=""
                    width="180px"
                  />
                </Link>
              </div>
              <div className="header__post-info">
                <div
                  className="header__icon-top-wrapper noti"
                  onClick={handleShowNotify}
                >
                  <i className=" header__icon header__icon-top icon-notify bx bx-bell"></i>
                </div>
                {currentUser.currentUser ? (
                  <div>
                    <div className="" onClick={handleShowDropDown}>
                      <img
                        src={
                          currentUser.currentUser.avatar
                            ? `https://${currentUser.currentUser.avatar.slice(7)}`
                            : "/icons/avatar.png"
                        }
                        alt=""
                        className="post-avt"
                        
                      />
                    </div>
                    {showDropDown && (
                      <div className="header__dropdown">
                        <header className="p-10 border-bottom">
                          <Link
                            to={`user/${currentUser.currentUser.userName}`}
                            className="header__dropdown-header p-10  "
                          >
                            <div div className="header__dropdown-img">
                              <img
                                src={
                                  currentUser.currentUser.avatar
                                    ? `https://${currentUser.currentUser.avatar.slice(7)}`
                                    : "/icons/avatar.png"
                                }
                                alt=""
                                className="post-avt"
                              />
                            </div>
                            <div className="header__dropdown-info">
                              <p className="header__dropdown-name">
                                {currentUser.currentUser.displayName
                                  ? currentUser.currentUser.displayName
                                  : currentUser.currentUser.userName}
                              </p>
                              <span className="header__dropdown-phone">
                                @
                                {currentUser.currentUser.mobile
                                  ? currentUser.currentUser.mobile
                                  : currentUser.currentUser.userName}
                              </span>
                            </div>
                          </Link>
                        </header>
                        <div className="header__dropdown-content">
                          <div className="p-7 border-bottom">
                            <ul className="header__dropdown-list ">
                              {headerDropDown.map((e, i) => (
                                <li
                                  key={i}
                                  className="header__dropdown-item p-13"
                                >
                                  <Link
                                    to={e.path}
                                    className="header__dropdown-link"
                                  >
                                    <i className="header__dropdown-icon">
                                      {e.icon}
                                    </i>
                                    <p className="header__dropdown-text">
                                      {e.displayName}
                                    </p>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="header__dropdown-config border-bottom">
                            <div className="p-10">
                              <Link
                                to="/user/settings"
                                className="header__dropdown-link p-10"
                              >
                                <i className="header__dropdown-icon">
                                  <svg
                                    _ngcontent-serverapp-c41=""
                                    id="Layer_1"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    data-name="Layer 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      _ngcontent-serverapp-c41=""
                                      d="M15.7218 5.84C15.1018 5.83 14.4918 5.56 14.0718 5.03C13.4918 4.28 13.4718 3.26 13.9418 2.49C12.8418 1.22 11.4318 0.38 9.91181 0C9.78181 0.29 9.5918 0.56 9.3318 0.77C8.4218 1.53 7.08181 1.38 6.34181 0.439999C6.23181 0.299999 6.1518 0.15 6.0818 0C4.9818 0.28 3.92181 0.79 2.98181 1.57C2.67181 1.83 2.3918 2.11 2.1318 2.4C2.7718 3.34 2.61181 4.64 1.73181 5.36C1.31181 5.71 0.791801 5.86 0.281801 5.83C-0.108199 7.32 -0.0981935 8.9 0.341807 10.39C0.981807 10.37 1.62181 10.64 2.05181 11.19C2.63181 11.93 2.6618 12.93 2.2118 13.7C3.2818 14.86 4.62181 15.63 6.05181 16C6.18181 15.67 6.3818 15.38 6.6718 15.14C7.5818 14.38 8.92181 14.53 9.66181 15.48C9.78181 15.64 9.88181 15.82 9.95181 16C11.0418 15.72 12.0918 15.21 13.0218 14.44C13.3318 14.18 13.6018 13.9 13.8618 13.61C13.3818 12.7 13.5818 11.53 14.4018 10.86C14.7718 10.55 15.2218 10.4 15.6618 10.39C16.0918 8.91 16.1218 7.33 15.7218 5.84ZM8.0018 11.53C6.0518 11.53 4.4718 9.95 4.4718 8C4.4718 6.05 6.0518 4.47 8.0018 4.47C9.9518 4.47 11.5318 6.05 11.5318 8C11.5318 9.95 9.9518 11.53 8.0018 11.53Z"
                                      className="cls-1"
                                    ></path>
                                  </svg>
                                </i>
                                <p className="header__dropdown-text">
                                  Edit Account
                                </p>
                              </Link>
                            </div>
                          </div>
                          <div className="header__dropdown-logout">
                            <div className="p-10">
                              <Link
                                to="/"
                                className="header__dropdown-link p-10 "
                              >
                                <i className="header__dropdown-icon">
                                  <svg
                                    _ngcontent-serverapp-c41=""
                                    id="Layer_1"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    data-name="Layer 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      _ngcontent-serverapp-c41=""
                                      d="M14.4399 8.8501H5.88989C5.33989 8.8501 4.88989 8.4001 4.88989 7.8501C4.88989 7.3001 5.33989 6.8501 5.88989 6.8501H14.4399C14.9899 6.8501 15.4399 7.3001 15.4399 7.8501C15.4399 8.4001 14.9999 8.8501 14.4399 8.8501Z"
                                      className="cls-1"
                                    ></path>
                                    <path
                                      _ngcontent-serverapp-c41=""
                                      d="M10.5299 13.1C10.2799 13.1 10.0299 13.01 9.83992 12.82C9.43992 12.44 9.42992 11.8 9.80992 11.4L13.1399 7.91996L9.82992 4.60996C9.43992 4.21996 9.43992 3.57996 9.82992 3.18996C10.2199 2.79996 10.8599 2.79996 11.2499 3.18996L15.0699 7.00996C15.5599 7.48996 15.5699 8.29996 15.0899 8.79996L11.2699 12.79C11.0599 12.99 10.7999 13.1 10.5299 13.1ZM13.6399 8.41996C13.6399 8.41996 13.6399 8.42996 13.6399 8.41996V8.41996Z"
                                      className="cls-1"
                                    ></path>
                                    <path
                                      _ngcontent-serverapp-c41=""
                                      d="M5.79 16H1C0.45 16 0 15.55 0 15V1C0 0.45 0.45 0 1 0H5.79C6.34 0 6.79 0.45 6.79 1C6.79 1.55 6.34 2 5.79 2H2V13.99H5.78C6.33 13.99 6.78 14.44 6.78 14.99C6.79 15.55 6.34 16 5.79 16Z"
                                      className="cls-1"
                                    ></path>
                                  </svg>
                                </i>
                                <p className="header__dropdown-text">
                                  Logout
                                </p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  "2"
                )}
              </div>
            </div>
          </div>
        </header>
      )
    ) : null
  ) : (
    ""
  );
};
export default Header;
