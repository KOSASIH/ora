import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
const Message = ({ message, own, receiverId }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios(`/api/v1/auth/user/${receiverId.toString()}`);
        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [receiverId ]);
  return (
    <>
      <div className="avatar-mes">
        {
          !own && receiverId ? (
            <Link to={`/user/${user?.user.userName}`}>
              <img src={user?.user.avatar ? `https://${user.user.avatar.slice(7)}` : "/icons/avatar.png"} alt="" />
            </Link>
          ) : ""
        }
      </div>
      <div className={`content ${own ? 'right' : 'left'}`}>
        <div className="inner-content">{message.text}</div>
      </div>
    </>
  );
};

export default Message;
