import React from 'react'
import './userssearch.scss'
import { Link } from "react-router-dom";
const UsersSearch = ({user}) => {
  return (
   <div className="user-container">
        <Link to={`/user/${user.userName}`} className="card-user">
            <img src={user.avatar ? `https://${user.avatar.slice(7)}` : "/icons/avatar.png"} alt="" className="post-avt" />
            <div className="user-info">
                <Link to={`/user/${user.userName}`} className="post-username">
                    <span>{user.displayName ? user.displayName : user.userName }</span>
                </Link>
            </div>
        </Link>
  </div>
  )
}

export default UsersSearch