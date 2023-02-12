import React, { useState, useEffect, useCallback } from "react";
import "./postitem.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import Toast from "../Toast/Toast";
import { userState$ } from "../../redux/selectors/";
import { useSelector } from "react-redux";
import DatePost from "../DatePost/DatePost";
const PostItem = ({ post }) => {
    let date = new Date();
    const currentUser = useSelector(userState$);
    const [datePost, setDatePost] = useState(null);
    const [message, setMessage] = useState(null);
    const [isBookmark, setIsBookmark] = useState(false);
    const [isVote, setIsVote] = useState(false);
    const [voteCount, setVoteCount] = useState(null);
    const [voteCountUpdate, setVoteCountUpdate] = useState(null);
    const handleSavePost = useCallback(async (e, id) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const option = {
                method: "put",
                url: `/api/v1/auth/save`,
                data: {
                    postId: id,
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            };
            const response = await axios(option);
            setIsBookmark(true);
            setMessage(response.data.data);
        } catch (err) {
            setMessage(null);
            setIsBookmark(false);
            setMessage(err.response.data.data);
        }
    }, []);
    const handleVote = useCallback(
        async (e, id) => {
            e.preventDefault();
            const token = localStorage.getItem("token");
            const option = {
                method: "post",
                url: `/api/v1/posts/vote`,
                data: {
                    postId: id,
                    action: "1",
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            };
            const res = await axios(option);
            setIsVote(!isVote);
            setVoteCountUpdate(res.data.points);
        },
        [isVote]
    );
    useEffect(() => {
        if (currentUser.currentUser?.postsSaved?.includes(post?._id)) {
            setIsBookmark(true);
        }
    }, [currentUser, post]);
    useEffect(() => {
        if (post.vote.includes(currentUser.currentUser?._id)) {
            setIsVote(true);
        }
    }, [currentUser, post]);
    useEffect(() => {
        if (post) {
            setVoteCount(post.vote.length - post.unVote.length);
        }
    }, [post]);
    useEffect(() => {
        if (voteCountUpdate || voteCountUpdate === 0) {
            setVoteCount(voteCountUpdate);
        }
    }, [voteCountUpdate]);
    return (
        <div className="row mb">
            {message ? <Toast message={message} /> : ""}
            <div className="col l-4 c-12">
                <div className="filter__content-img">
                    <Link to={`/post/${post.slug}`} className="filter__content-">
                        <img
                            src={post.attachment ? `https://${post.attachment.slice(7)}` : "/images/home-bg.png"}
                            alt="Ảnh của bài viết"
                            className="filter__content-img-item"
                        />
                    </Link>
                </div>
            </div>
            <div className="col l-8 c-12">
                <div className="filter__content-container">
                    <div className="filter__content-heading">
                        <div>
                            <Link to={`/category/${post.category.slug}`}>
                                <span className="title-category">{post.category.name}</span>
                            </Link>
                            <span className="time-read">4 min read</span>
                        </div>
                        <Link
                            to={`/`}
                            onClick={(e) => {
                                handleSavePost(e, post._id);
                            }}
                            className={`post_saved`}
                            title="Click để lưu bài viết"
                        >
                            {isBookmark ? (
                                <i className="bx bxs-bookmark-alt"></i>
                            ) : (
                                <i className="bx bx-bookmark-alt"></i>
                            )}
                        </Link>
                    </div>
                    <div className="filter__content-main">
                        <Link to={`/post/${post.slug}`}>
                            <h3 className="title-post">{post.title}</h3>
                        </Link>
                        <div className="">
                            <p className="text-intro">{post.description}</p>
                        </div>
                    </div>
                    <div className="filter__content-author">
                        <div className="filter__content-author-user">
                            <div className="post-avt">
                                <Link to={`/user/${post.author.userName}`}>
                                    <img
                                        className="post-avt"
                                        src={post.author.avatar ? post.author.avatar : "/icons/avatar.png"}
                                        alt=""
                                    />
                                </Link>
                            </div>
                            <div>
                                <Link to={`/user/${post.author.userName}`}>
                                    <p className="post-username">
                                        {post.author.displayName ? post.author.displayName : post.author.userName}
                                    </p>
                                </Link>
                                <DatePost date={post.createdAt}></DatePost>
                            </div>
                        </div>
                        <div className="filter__content-interactive">
                            <div
                                className="filter__content-interactive-container"
                                title="Upvote cho bài viết này"
                                onClick={(e) => handleVote(e, post._id)}
                            >
                                {isVote ? (
                                    <i className="vote-icon bx bxs-up-arrow like"></i>
                                ) : (
                                    <i className="bx bx-up-arrow"></i>
                                )}
                                <span className="post-icon">{voteCount}</span>
                            </div>
                            <div className="filter__content-interactive-container">
                                <svg
                                    fill="#969696"
                                    _ngcontent-serverapp-c41=""
                                    width="21"
                                    height="14"
                                    viewBox="0 0 21 14"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        _ngcontent-serverapp-c41=""
                                        d="M10.125 3.3125C9.73828 3.34766 9.35156 3.38281 9 3.48828C9.17578 3.76953 9.24609 4.12109 9.28125 4.4375C9.28125 5.52734 8.36719 6.40625 7.3125 6.40625C6.96094 6.40625 6.60938 6.33594 6.36328 6.16016C6.25781 6.51172 6.1875 6.86328 6.1875 7.25C6.1875 9.42969 7.94531 11.1875 10.125 11.1875C12.3047 11.1875 14.0625 9.42969 14.0625 7.25C14.0625 5.10547 12.3047 3.34766 10.125 3.34766V3.3125ZM20.1094 6.75781C18.2109 3.03125 14.4141 0.5 10.125 0.5C5.80078 0.5 2.00391 3.03125 0.105469 6.75781C0.0351562 6.89844 0 7.07422 0 7.25C0 7.46094 0.0351562 7.63672 0.105469 7.77734C2.00391 11.5039 5.80078 14 10.125 14C14.4141 14 18.2109 11.5039 20.1094 7.77734C20.1797 7.63672 20.2148 7.46094 20.2148 7.28516C20.2148 7.07422 20.1797 6.89844 20.1094 6.75781ZM10.125 12.3125C6.64453 12.3125 3.44531 10.3789 1.75781 7.25C3.44531 4.12109 6.64453 2.1875 10.125 2.1875C13.5703 2.1875 16.7695 4.12109 18.457 7.25C16.7695 10.3789 13.5703 12.3125 10.125 12.3125Z"
                                        className=" cls-1"
                                    ></path>
                                </svg>
                                <span className="post-icon">{post.views}</span>
                            </div>
                            <Link to={`/post/${post.slug}`}>
                                <div className="filter__content-interactive-container">
                                    <svg
                                        fill="#969696"
                                        color="#969696"
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
                                    <span className="post-icon">{post.comment_count}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
