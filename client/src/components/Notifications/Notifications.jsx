import React from "react";
import { Link } from "react-router-dom";
const Notifications = ({ notification }) => {
    let date = new Date(notification.createdAt);
    return notification.post ? (
        <li className={`header__notify-item ${notification.isRead ? "" : "active"}`}>
            <Link to={`/post/${notification.post.slug}?notiId=${notification._id}`} className={`header__notify-link`}>
                <div className="header__notify-menu">
                    <div className="header__notify-image">
                        <Link to={`/user/${notification.parentId.userName}`}>
                            <img
                                src={
                                    notification.parentId.avatar
                                        ? `https://${notification.parentId.avatar.slice(7)}`
                                        : "https://s3-ap-southeast-1.amazonaws.com/images.Piora.com/sp-xs-avatar/c7967c50a8e811ec8f3e8be3eb7f2505.png"
                                }
                                alt=""
                                className="header__notify-img"
                            />
                        </Link>
                    </div>
                    <div className="header__notify-info">
                        <div className="header__notify-info-container">
                            <span className="header__notify-strong">
                                <b>
                                    {notification.parentId.displayName
                                        ? notification.parentId.displayName
                                        : notification.parentId.userName}{" "}
                                </b>
                            </span>
                            <span>writed a new post: </span>
                            <q className="header__notify-strong header__notify-content">
                                <b className="">{notification.post.title}</b>
                            </q>
                        </div>
                    </div>
                    <div className="header__notify-icon">
                        <i className=" bx bx-dots-horizontal-rounded"></i>
                    </div>
                </div>
                <div className="header__notify-time">
                    <i className="bx bxs-conversation"></i>
                    <span className="time">{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                </div>
            </Link>
        </li>
    ) : (
        <li className={`header__notify-item ${notification.isRead ? "" : "active"}`}>
            <Link
                to={`/user/${notification.parentId.userName}?notiId=${notification._id}`}
                className={`header__notify-link`}
            >
                <div className="header__notify-menu">
                    <Link to={`/user/${notification.parentId.userName}?notiId=${notification._id}`}>
                        <img
                            src={notification.parentId.avatar ? notification.parentId.avatar : "/icons/avatar.png"}
                            alt=""
                            className="header__notify-img"
                        />
                    </Link>
                    <div className="header__notify-info">
                        <div className="header__notify-info-container">
                            <span className="header__notify-strong">
                                <b>
                                    {notification.parentId.displayName
                                        ? notification.parentId.displayName
                                        : notification.parentId.userName}{" "}
                                </b>
                            </span>
                            <span> follow you </span>
                        </div>
                    </div>
                    <i className=" header__notify-icon bx bx-dots-horizontal-rounded"></i>
                </div>
                <div className="header__notify-time">
                    <i className="bx bxs-conversation"></i>
                    <span className="time">{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                </div>
            </Link>
        </li>
    );
};

export default Notifications;
