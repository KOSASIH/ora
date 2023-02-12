import React, { useState, useEffect } from "react";
import axios from "axios";
const MessageHeader = ({ receiverId }) => {
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
    }, [receiverId]);
    return (
        <div className="mes__box-header">
            <h2 className="mes__box-username">
                {user?.user?.displayName ? user?.user?.displayName : user?.user?.userName}
            </h2>
        </div>
    );
};

export default MessageHeader;
