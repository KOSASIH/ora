import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./suggest.scss";
import { allPostsState$ } from "../../redux/selectors";
import { useSelector } from "react-redux";
import DatePost from "../DatePost/DatePost";
import { useTranslation } from "react-i18next";
const Suggest = () => {
    const { t } = useTranslation();
    const date = new Date();
    const posts = useSelector(allPostsState$);
    return (
        <section className="suggest container">
            <div className="suggest__wrapper">
                <h3 className="title">{t("dontmiss")}</h3>
            </div>
            <div className="suggest__main">
                <div className="grid">
                    <div className="row">
                        <div className="col c-12 m-5 l-5">
                            {posts.data.slice(0, 1).map((post, idx) => (
                                <div className="suggest__content" key={idx}>
                                    <div className="suggest__content-img-left">
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={
                                                    post.attachment
                                                        ? `https://${post.attachment.slice(7)}`
                                                        : "/images/home-bg.png"
                                                }
                                                alt=""
                                            />
                                        </Link>
                                    </div>
                                    <div className="suggest__content-details">
                                        <div className="suggest__content-details-heading">
                                            <div>
                                                <Link to={`/category/${post.category.slug}`}>
                                                    <span className="title-category">{post.category.name}</span>
                                                </Link>
                                                <span className="time-read">4 min read</span>
                                            </div>
                                            <div className="post_saved" title="Click để lưu bài viết ">
                                                <i className="bx bx-bookmark-alt"></i>
                                            </div>
                                        </div>
                                        <div className="suggest__content-details-main">
                                            <Link to={`/post/${post.slug}`}>
                                                <h3 className="title-post">{post.title}</h3>
                                            </Link>
                                            <div className="suggest__content-details-desc">
                                                <h3 className="suggest__content-details-desc-text">
                                                    {post.description}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="suggest__content-details-post">
                                            <div className="suggest__content-details-post-user">
                                                <div className="post-avt">
                                                    <Link to={`/user/${post.author.userName}`}>
                                                        <img
                                                            src={
                                                                post.author.avatar
                                                                    ? `https://${post.author.avatar.slice(7)}`
                                                                    : "/icons/avatar.png"
                                                            }
                                                            alt=""
                                                            className="post-avt"
                                                        />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link to={`/user/${post.author.userName}`}>
                                                        <p className="post-username">
                                                            {post.author.displayName
                                                                ? post.author.displayName
                                                                : post.author.userName}
                                                        </p>
                                                    </Link>
                                                    <DatePost date={post.createdAt}></DatePost>
                                                </div>
                                            </div>

                                            <div className="suggest__content-details-post-icon">
                                                <div className="suggest-icon-container">
                                                    <i className="post-icon-suggest bx bx-up-arrow"></i>
                                                    <span className="post-icon-suggest-text">
                                                        {post.vote.length ? post.vote.length : "0"}
                                                    </span>
                                                </div>

                                                <Link to={`/post/${post.slug}`}>
                                                    <div className="suggest-icon-container">
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
                                                        <span className="post-icon-suggest-text">
                                                            {post.comment_count}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col c-12 m-7 l-7" id="slideBar">
                            <div className="gird">
                                <div className="row">
                                    {posts.data.slice(0, 3).map((post, idx) => (
                                        <div className="col l-12" key={idx}>
                                            <div className="suggest__content">
                                                <div className="grid">
                                                    <div className="row">
                                                        <div className="col l-4 c-12 ">
                                                            <div>
                                                                <Link to="/">
                                                                    <img
                                                                        src={
                                                                            post.attachment
                                                                                ? `https://${post.attachment.slice(7)}`
                                                                                : "/images/home-bg.png"
                                                                        }
                                                                        alt=""
                                                                        className="thumbnail"
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div className="col l-8 c-12">
                                                            <div className="suggest__content-details">
                                                                <div className="suggest__content-details-heading">
                                                                    <div>
                                                                        <Link to={`/category/${post.category.slug}`}>
                                                                            <span className="title-category">
                                                                                {post.category.name}
                                                                            </span>
                                                                        </Link>
                                                                        <span className="time-read">6 min read</span>
                                                                    </div>
                                                                    <div className="post_saved">
                                                                        <i className="bx bx-bookmark-alt"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="suggest__content-details-main">
                                                                    <Link to={`/post/${post.slug}`}>
                                                                        <h3 className="title-post">{post.title}</h3>
                                                                    </Link>
                                                                    <div className="suggest__content-details-desc">
                                                                        <p className="text-intro">{post.description}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="suggest__content-details-post">
                                                                    <div className="suggest__content-details-post-user">
                                                                        <div className="post-avt">
                                                                            <Link to={`/user/${post.author.userName}`}>
                                                                                <img
                                                                                    className="post-avt"
                                                                                    src={
                                                                                        post.author.avatar
                                                                                            ? `https://${post.author.avatar.slice(
                                                                                                  7
                                                                                              )}`
                                                                                            : "/icons/avatar.png"
                                                                                    }
                                                                                    alt=""
                                                                                />
                                                                            </Link>
                                                                        </div>
                                                                        <div>
                                                                            <Link to={`/user/${post.author.userName}`}>
                                                                                <p className="post-username">
                                                                                    {post.author.displayName
                                                                                        ? post.author.displayName
                                                                                        : post.author.userName}
                                                                                </p>
                                                                            </Link>
                                                                            <span className="time-read">
                                                                                <DatePost date={post.createdAt} />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="suggest__content-details-post-icon">
                                                                        <div className="suggest-icon-container">
                                                                            <i className="post-icon-suggest bx bx-up-arrow"></i>
                                                                            <span className="post-icon-suggest-text">
                                                                                {" "}
                                                                                {post.vote.length
                                                                                    ? post.vote.length
                                                                                    : "0"}
                                                                            </span>
                                                                        </div>
                                                                        <Link to={`/post/${post.slug}`}>
                                                                            <div className="suggest-icon-container">
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
                                                                                <span className="post-icon-suggest-text">
                                                                                    {post.comment_count}
                                                                                </span>
                                                                            </div>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Suggest;
