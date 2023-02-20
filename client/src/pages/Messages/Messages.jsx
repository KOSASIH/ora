import React, { useCallback, useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { userState$ } from "../../redux/selectors";
import "./messages.scss";
import { io } from "socket.io-client";
import Conversations from "../../components/Conversations/Conversations";
import Message from "../../components/Message/Message";
import MessageHeader from "../../components/MessageHeader/MessageHeader";
import { useTranslation } from "react-i18next";

const Messages = () => {
    const { t } = useTranslation();
    const userState = useSelector(userState$);
    const [conversations, setConversations] = useState([]);
    const [countNotiMes, setCountNotiMes] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const uid = searchParams.get("uid");
    useEffect(() => {
        socket.current = io("wss://piora.space:8081");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);
    useEffect(() => {
        socket.current.emit("addUser", userState.currentUser?._id);
    }, [userState]);
    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);
    const createConversation = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            const option = {
                method: "post",
                url: `/api/v1/conversation/`,
                data: {
                    receiverId: uid,
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            };
            const res = await axios(option);
            console.log(res.data);
        } catch (err) {}
    }, [uid]);
    useEffect(() => {
        createConversation();
    }, [createConversation]);
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`api/v1/conversation/${userState.currentUser._id}`);
                setConversations(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [userState]);
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`api/v1/messages/${currentChat._id}`);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);
    const onSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            const receiverId = currentChat?.members.find((member) => member !== userState.currentUser?._id);
            const message = {
                sender: userState.currentUser?._id,
                text: newMessage,
                conversationId: currentChat?._id,
                receiverId: receiverId,
            };
            socket.current.emit("sendMessage", {
                senderId: userState.currentUser?._id,
                receiverId,
                text: newMessage,
            });
            try {
                const res = await axios.post("api/v1/messages", message);
                setMessages([...messages, res.data]);
                setNewMessage("");
            } catch (err) {
                console.log(err);
            }
        },
        [currentChat, messages, newMessage, userState]
    );
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
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
                setCountNotiMes(res.data.data.notification);
            } catch (err) {}
        }
    }, []);
    useEffect(() => {
        getNotificationsMessage();
    }, [getNotificationsMessage]);
    const handleBack = () => {
        window.location.href = "/";
        
    };
    return (
        <div className="mes">
            <div className="mes__header">
                <div className="mes__header-logo">
                    <Link to="/" onClick={handleBack}>
                        <img src="/icons/wideLogo.png" alt="" className="mes__header-logo-img" />
                    </Link>
                </div>
            </div>
            <div className="mes__main">
                <div className="mes__sidebar">
                    <div className="mes__search">
                        <input type="text" placeholder={t("searchbyname")} className="mes__search-input" />
                    </div>
                    <ul className="mes__chatlist">
                        {conversations.length > 0
                            ? conversations.map((conversation) => (
                                  <li
                                      onClick={() => setCurrentChat(conversation)}
                                      className={`mes__chatitem ${
                                          currentChat?._id === conversation._id ? "active" : ""
                                      }`}
                                  >
                                      <Conversations
                                          key={conversation._id}
                                          conversation={conversation}
                                          currentUser={conversation.members.filter(
                                              (member) => member !== userState.currentUser?._id
                                          )}
                                          notiId={countNotiMes?.map((e) => e.parentId._id)}
                                          // currentChat={currentChat?._id}
                                      />
                                  </li>
                              ))
                            : ""}
                        {currentChat ? (
                            <>
                                <MessageHeader
                                    receiverId={currentChat?.members.filter(
                                        (member) => member !== userState.currentUser?._id
                                    )}
                                />
                                <div className="mes__box-content">
                                    <div className="mes__box-time">
                                        <p>May 8, 2023</p>
                                    </div>
                                    <div className="mes__box-chat">
                                        <div className="mes__box-chat-buble">
                                            {messages.length > 0
                                                ? messages.map((message) => (
                                                      <div
                                                          ref={scrollRef}
                                                          className={`chat-buble ${
                                                              message.sender === userState.currentUser?._id
                                                                  ? "right"
                                                                  : "left"
                                                          }`}
                                                      >
                                                          <Message
                                                              key={message._id}
                                                              message={message}
                                                              receiverId={currentChat?.members.filter(
                                                                  (member) => member !== userState.currentUser?._id
                                                              )}
                                                              own={message.sender === userState.currentUser?._id}
                                                          />
                                                      </div>
                                                  ))
                                                : ""}
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={onSubmit} className="mes__box-input">
                                    <div className="mes__box-input-container">
                                        <input
                                            className="mes__box-input-text"
                                            type="text"
                                            placeholder="..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button type="submit" className="send" onClick={handleSubmit}>
                                            <i className="bx bx-send"></i>
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <p className="picked-mes">{t("choosechat")}</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Messages;
