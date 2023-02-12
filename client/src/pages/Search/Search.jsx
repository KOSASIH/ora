import React, { useCallback, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import PostItem from "../../components/PostItem/PostItem";
import "./search.scss";
import axios from "axios";
import UsersSearch from "../../components/UsersSearch/UsersSearch";
const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const query = searchParams.get("q");
    const type = searchParams.get("type");
    const getData = useCallback(async () => {
        const response = await axios.get(`/api/v1/search?q=${query}`);
        setUsers(response.data.data.users);
        setPosts(response.data.data.posts);
    }, [query]);
    useEffect(() => {
        getData();
    }, [getData]);
    return (
        <div className="search">
            <div className="search__container">
                <div className="search__heading">
                    <h3 className="search__heading-name">
                        Kết quả tìm kiếm:
                        <span> "{query}"</span>
                    </h3>
                </div>
                <div className="search__content">
                    <div className="search__content-body">
                        <div className="search__content-nav">
                            <ul className="search__content-nav-menu">
                                <li
                                    className="search__content-nav-item"
                                    onClick={() => navigate(`/search?q=${query}&type=post`)}
                                >
                                    <div
                                        className={`search__content-nav-item-wrapper ${
                                            type === "post" ? "active" : ""
                                        }`}
                                    >
                                        <Link to="/" className="search__content-nav-link">
                                            <i className="search__content-nav-icon bx bxs-file"></i>
                                            <span className="search__content-nav-text">Bài viết</span>
                                        </Link>
                                    </div>
                                </li>
                                <li
                                    className="search__content-nav-item"
                                    onClick={() => navigate(`/search?q=${query}&type=user`)}
                                >
                                    <div
                                        className={`search__content-nav-item-wrapper ${
                                            type === "user" ? "active" : ""
                                        }`}
                                    >
                                        <Link to="/" className="search__content-nav-link">
                                            <i className="search__content-nav-icon bx bxs-user"></i>
                                            <span className="search__content-nav-text">Người dùng</span>
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="search__content-result">
                            {type === "post"
                                ? posts.map((post) => <PostItem post={post} key={post._id} />)
                                : users.slice(0, 10).map((user) => <UsersSearch user={user} key={user._id} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
