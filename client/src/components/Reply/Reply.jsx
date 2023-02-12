import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Reply = ({ reply, visible }) => {
    let date = new Date(reply.createdAt);
    const [voteCountReply, setVoteCountReply] = useState(null);
    const [voteCountReplyUpdate, setVoteCountReplyUpdate] = useState([]);
    useEffect(() => {
        if (reply.voteCount) {
            setVoteCountReply(reply.voteCount.length);
        }
    }, [reply.voteCount]);
    const handleVoteReply = useCallback(async (id) => {
        const token = localStorage.getItem("token");
        const option = {
            method: "post",
            url: `/api/v1/reply/reply/vote/`,
            data: {
                replyId: id,
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const res = await axios(option);
        setVoteCountReplyUpdate(res.data.data.voteCount);
    }, []);
    console.log(voteCountReply);
    useEffect(() => {
        if (voteCountReplyUpdate) {
            setVoteCountReply(voteCountReplyUpdate.length);
        }
    }, [voteCountReplyUpdate]);
    return (
        <div className="comment-node">
            <div className="comment__child-avt">
                <Link to={`/user/${reply.author.userName}`}>
                    <img
                        src={reply.author.avatar ? `https://${reply.author.avatar.slice(7)}` : "/icons/avatar.png"}
                        alt=""
                    />
                </Link>
            </div>
            <div className="comment__child-body">
                <div className="creator-info">
                    <Link to={`/user/${reply.author.userName}`}>
                        <span className="name-main">
                            {reply.author.displayName ? reply.author.displayName : reply.author.userName}
                        </span>
                    </Link>
                    <div className="metadata">
                        <span className="date">{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                    </div>
                    <div className="comment__child-content">{reply.content}</div>
                    <div className="comment__child-actions">
                        <div className="vote">
                            <div className="upvote" onClick={() => handleVoteReply(reply._id)}>
                                <div className="vote-icon">
                                    <i className="bx bxs-up-arrow"></i>
                                </div>
                            </div>
                            <div></div>
                            <span className="value">{voteCountReply ? voteCountReply : reply.voteCount.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reply;
