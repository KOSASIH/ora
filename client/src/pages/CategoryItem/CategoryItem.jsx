import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { userState$ } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import "./categoryitem.scss";
import Filter from "../../components/Filter/Filter";
import DatePost from "../../components/DatePost/DatePost";
import { useTranslation } from "react-i18next";
const CategoryItem = () => {
    const { t } = useTranslation();
    const currentUser = useSelector(userState$);
    const dispatch = useDispatch();
    const { slug } = useParams();
    const [postItem, setPostItem] = useState([]);
    const [id, setId] = useState("");
    const [data, setData] = useState({});
    const [cateUpdate, setCateUpdate] = useState({
        category: "",
    });
    const [policy, setPolicy] = useState([]);
    const [isFollow, setIsFollow] = useState(false);
    const getCategory = useCallback(async () => {
        const res = await axios.get(`/api/v1/category/${slug}`);
        setId(res.data.data.category._id);
        setData(res.data.data.category);
        setPolicy(res.data.data.category.policy);
    }, [slug]);
    const getPost = useCallback(async () => {
        if (id) {
            const arr = [];
            const resPost = await axios.get(`/api/v1/posts/cate/${id}`);
            setPostItem(resPost.data.data.posts);
            arr.push(id);
            setCateUpdate(arr);
        }
    }, [id]);
    useEffect(() => {
        getCategory();
        getPost();
    }, [getCategory, getPost]);
    useEffect(() => {
        if (currentUser.currentUser) {
            if (currentUser.currentUser.category) {
                const result = currentUser.currentUser.category.filter((e) => e._id === id);
                if (result.length === 0) {
                    setIsFollow(false);
                } else {
                    setIsFollow(true);
                }
            }
        }
    }, [currentUser, id]);
    const onSubmit = useCallback(
        (e) => {
            try {
                e.preventDefault();
                dispatch(actions.createCategoryUser.createCategoryUserRequest(cateUpdate));
            } catch (err) {
                dispatch(actions.createCategoryUser.createCategoryUserFailure());
            }
        },
        [dispatch, cateUpdate]
    );
    const handleSubmit = useCallback(
        (e) => {
            try {
                e.preventDefault();
                dispatch(actions.deleteCategoryUser.deleteCategoryUserRequest(cateUpdate));
            } catch (err) {
                dispatch(actions.deleteCategoryUser.deleteCategoryUserFailure());
            }
        },
        [dispatch, cateUpdate]
    );
    useEffect(() => {
        if (data.name) {
            document.title = data.name;
        }
    }, [data.name]);
    return (
        <div className="main">
            <section className="category">
                <header className="category__header">
                    <div
                        className="category__header-background"
                        style={{ backgroundImage: `url(${data.attachment})` }}
                    ></div>
                    <div className="category__header-container">
                        <div className="category__header-info">
                            <p className="category__header-title">{data.name}</p>
                            {isFollow ? (
                                <div onClick={() => window.location.reload(false)}>
                                    <button className="button-page" type="submit" onClick={handleSubmit}>
                                        <span className="button-icon">
                                            <i className="bx bx-check"></i>
                                        </span>
                                        {t("following")}
                                    </button>
                                </div>
                            ) : (
                                <div onClick={() => window.location.reload(false)}>
                                    <button className="button-page" type="submit" onClick={onSubmit}>
                                        {t("follow")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="category__main">
                    <div className="grid">
                        <div className="row">
                            <div className="col l-8">
                                <div className="category__content">
                                    {postItem.slice(0, 1).map((e, i) => (
                                        <div className="category__content-post">
                                            <div className="category__content-post-img">
                                                <img
                                                    src={
                                                        e.attachment
                                                            ? `https://${e.attachment.slice(7)}`
                                                            : "/images/home-bg.png"
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <div className="category__content-post-details">
                                                <div className="category__content-post-details-heading flex-box">
                                                    <div>
                                                        <Link to="/">
                                                            <span className="title-category">{e.category.name}</span>
                                                        </Link>
                                                        <span className="time-read">
                                                            4 {t("min")} {t("read")}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <svg
                                                            _ngcontent-serverapp-c41=""
                                                            id="Layer_1"
                                                            data-name="Layer 1"
                                                            fill="#969696"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 500 500"
                                                            height="25"
                                                            width="25"
                                                        >
                                                            <path
                                                                _ngcontent-serverapp-c41=""
                                                                d="M171.88,52.08a68,68,0,0,0-67.71,67.71v312.5A15.63,15.63,0,0,0,128.93,445L250,357.79,371.07,445a15.62,15.62,0,0,0,24.76-12.68V119.79a68,68,0,0,0-67.7-67.71Zm0,31.25H328.13a36.23,36.23,0,0,1,36.45,36.46v282L259.13,325.87a15.61,15.61,0,0,0-18.26,0L135.42,401.79v-282A36.23,36.23,0,0,1,171.88,83.33Z"
                                                                className="cls-1"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Link to={`/post/${e.slug}`}>
                                                        <h3 className="title-post">{e.title}</h3>
                                                    </Link>
                                                    <div>
                                                        <p className="text-intro">{e.description}</p>
                                                    </div>
                                                    <div className="category__content-post-author flex-end">
                                                        <div className="flex-align-gap-10">
                                                            <div>
                                                                <Link to={`/user/${e.author.userName}`}>
                                                                    <img
                                                                        src={
                                                                            e.author.avatar
                                                                                ? `https://${e.author.avatar.slice(7)}`
                                                                                : "/icons/avatar.png"
                                                                        }
                                                                        alt=""
                                                                        className="post-avt"
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div>
                                                                <Link to={`/user/${e.author.userName}`}>
                                                                    <p className="post-username">
                                                                        {e.author.displayName
                                                                            ? e.author.displayName
                                                                            : e.author.userName}
                                                                    </p>
                                                                </Link>
                                                                <DatePost date={e.createdAt}></DatePost>
                                                            </div>
                                                        </div>
                                                        <div className="flex-gap-20">
                                                            <div>
                                                                <i className="post-icon bx bx-up-arrow"></i>
                                                                <span className="post-icon">{e.voteCount}</span>
                                                            </div>
                                                            <Link to="/" className="flex-align-gap-10">
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
                                                                <span className="post-icon">{e.views}</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="category__content-filter">
                                        <Filter posts={postItem} />
                                    </div>
                                </div>
                            </div>
                            <div className="col l-4">
                                <div className="sidebar">
                                    <div className="sidebar__policy widget-container">
                                        <h3 className="title-post">{data.name}</h3>
                                        <div className="sidebar__policy-content">
                                            <p className="widget-title">{t("content_allowed")}</p>
                                            <p>{data.rules}</p>
                                            <p className="widget-title">{t("policy")}</p>
                                            <ul className="sidebar__policy-menu">
                                                {policy.map((e, i) => (
                                                    <li key={i}>{e.content}</li>
                                                ))}
                                            </ul>
                                            {isFollow ? (
                                                <div>
                                                    <button
                                                        className="button-page"
                                                        type="submit"
                                                        onClick={handleSubmit}
                                                    >
                                                        <span className="button-icon">
                                                            <i className="bx bx-check"></i>
                                                        </span>
                                                        {t("following")}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <button className="button-page" type="submit" onClick={onSubmit}>
                                                        {t("follow")}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="sidebar__donate widget-container mtb-20">
                                        <p>{t("you_love_piora_and_want_to_help_us")}</p>
                                        <Link to="/">
                                            <button className="button-page mt-20">
                                                <span className="button-icon">
                                                    <i className="bx bx-check"></i>
                                                </span>
                                                {t("donate")}
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="sidebar__suggest box-shadow border">
                                        <p className="sidebar__suggest-title border-bottom">
                                            {t("MAY_BE_GOOD_FOR_YOU")}
                                        </p>
                                        <div className="sidebar__suggest-content">
                                            <div className="sidebar__suggest-content-container">
                                                <div className="post-avt-div">
                                                    <Link to="/">
                                                        <img
                                                            src="https://s3-ap-southeast-1.amazonaws.com/images.Piora.com/sp-xs-avatar/1b57d9b09c7d11ec80afdf2810a9ede6.jpeg"
                                                            alt=""
                                                            className="post-avt-div-img"
                                                        />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <p className="post-title">
                                                        <Link to="/">{t("welcome_to_piora")}</Link>
                                                    </p>
                                                    <Link to="/">
                                                        <span className="username">{t("piora")} </span>
                                                    </Link>
                                                    <span className="time-read"> - 2023</span>
                                                </div>
                                            </div>
                                            <div className="sidebar__suggest-content-container">
                                                <div className="post-avt-div">
                                                    <Link to="/">
                                                        <img
                                                            src="https://s3-ap-southeast-1.amazonaws.com/images.Piora.com/sp-xs-avatar/1b57d9b09c7d11ec80afdf2810a9ede6.jpeg"
                                                            alt=""
                                                            className="post-avt-div-img"
                                                        />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <p className="post-title">
                                                        <Link to="/">{t("policy")}</Link>
                                                    </p>
                                                    <Link to="/">
                                                        <span className="username">Piora </span>
                                                    </Link>
                                                    <span className="time-read"> - 2023</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CategoryItem;
