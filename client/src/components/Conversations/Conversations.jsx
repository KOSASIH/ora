import React, { useEffect, useState,  useCallback } from "react";
import axios from "axios";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
const Conversations = ({ conversation, currentUser, notiId }) => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios(`/api/v1/messages/${conversation?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios(`/api/v1/auth/user/${currentUser.toString()}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  useEffect(() => {
    if (messages.length > 0) {
      setPreview(messages.slice(-1));
    }
  }, [messages]);
  const readNotiMes = useCallback(async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const option = {
          method: "put",
          url: `/api/v1/notimes/read`,
          data : {
            "targetUser" :id
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios(option);
      } catch (err) {}
    }
  },[])
  return (
    <>
      {!user && <SkeletonCard />}
      {user && (
        <>
          <div className="mes__chatavt">
            <img
              src={
                user?.data.user?.avatar
                  ? `https://${user?.data.user?.avatar.slice(7)}`
                  : "/icons/avatar.png"
              }
              alt=""
            />
          </div>
          <span className="mes__time">1:49 PM</span>
          <div className="mes__content" onClick={() => readNotiMes(user?.data.user?._id)}>
            <h2 className="mes__title">
              {user?.data.user?.displayName
                ? user.data.user.displayName
                : user?.data.user?.userName}
            </h2>
            <div className="mes__preview">
              {preview?.map((p) => (
                <span>{p.text}</span>
              ))}
              {
                notiId?.includes(user?.data.user?._id) ? (
                  <div className="mes__unread">
                    <span></span>
                  </div>
                ) : ""
              }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Conversations;
