import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { allPostsState$ } from "../../redux/selectors/";
import DatePost from "../DatePost/DatePost";
import { donatePi } from "../../components/pisdk/pisdk.tsx";
import "./adv.scss";
import isPiBrowser from "../isPiBrowser/isPiBrowser";
import { useTranslation } from "react-i18next";
const Adv = () => {
    const { t } = useTranslation();
    const posts = useSelector(allPostsState$);
    const donate = useCallback(async (e) => {
        e.preventDefault();
        const piB =isPiBrowser()
        if (!piB) return alert(t("notPiBrowser"))
       else  donatePi("to Piora", 1, { To: "Piora" });
    }, []);
    return (
        <div className="adv">
            <div className="adv__donate box-shadow ">
                <p className="adv__donate-content">{t("you_love_piora_and_want_to_help_us")}</p>
                <Link to="/" className="adv__donate-link">
                    <button className="adv__donate-button" onClick={donate}>
                        <i className="bx bx-donate-heart  adv__donate-icon"></i>
                        Donate
                    </button>
                </Link>
            </div>
            <div className="adv__widget box-shadow ">
                <p className="adv__widget-title">{t("maybeyoulike")}</p>
                <div className="adv__widget-content">
                    {posts.data.slice(0, 5).map((post) => (
                        <div className="adv__widget-content-details">
                            <div className="adv__widget-avt">
                                <Link to={`/user/${post.author.userName}`}>
                                    <img
                                        src={
                                            post.author.avatar
                                                ? `https://${post.author.avatar.slice(7)}`
                                                : "/icons/avatar.png"
                                        }
                                        alt=""
                                    />
                                </Link>
                            </div>
                            <div className="adv__widget-user">
                                <Link to={`/post/${post.slug} `}>
                                    <p className="post-title">{post.title}</p>
                                </Link>
                                <Link to={`/user/${post.author.userName} `}>
                                    <span className="username">
                                        {post.author.displayName ? post.author.displayName : post.author.userName}{" "}
                                    </span>
                                </Link>
                                <DatePost date={post.createdAt}></DatePost>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="adv__contact box-shadow ">
                <p className="adv__contact-heading">{t("link")}</p>
                <div className="adv__contact-social">
                    <ul className="adv__contact-social-list">
                        <li className="adv__contact-social-item"></li>
                        <Link
                            to="https://facebook.com/profile.php?id=100089642546736"
                            className="adv__contact-social-link"
                        >
                            <i className="adv__contact-social-icon fb bx bxl-facebook-square"></i>
                            <span className="adv__contact-social-text">Fanpage Piora</span>
                        </Link>

                        <li className="adv__contact-item">
                            <Link to="https://www.youtube.com/@pioraofficial" className="adv__contact-social-link">
                                <i className=" adv__contact-social-icon yt bx bxl-youtube"></i>
                                <span className="adv__contact-social-text">Piora Youtube</span>
                            </Link>
                        </li>

                        <li className="adv__contact-item">
                            <Link to="mailto:contact@piora.space" className="adv__contact-social-link">
                                <i className="adv__contact-social-icon chat bx bxs-conversation"></i>
                                <span className="adv__contact-social-text">Feedback Piora</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="adv__about">
                <ul className="adv__about-list">
                    <li className="adv__about-item">
                        <Link to="/post/terms-of-use" className="adv__about-link">
                            <span className="adv__about-text">{t("TERMS_OF_USE")}</span>
                        </Link>
                    </li>
                    <li className="adv__about-item">
                        <Link to="/post/privacy-policy" className="adv__about-link">
                            <span className="adv__about-text">{t("policy")}</span>
                        </Link>
                    </li>
                </ul>
                <span className="adv__about-text">© 2023 ORA LAB</span>
            </div>
        </div>
    );
};

export default Adv;
