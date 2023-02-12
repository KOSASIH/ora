import React, { useCallback, useRef, useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as actions from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { categoriesState$ } from "../../redux/selectors";
import { Config } from "./tools";
import axios from "axios";
import "../CreatePost/createpost.scss";
import "./editpost.scss";
import { useTranslation } from "react-i18next";
const CreatePost = () => {
    const { t } = useTranslation();
    const categorise = useSelector(categoriesState$);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refEdit = useRef();
    const [editor, seteditor] = useState({});
    const [visible, setVisible] = useState(false);
    const [slug, setSlug] = useState("");
    const [data, setData] = useState({});
    const [dataPost, setDataPost] = useState({});
    const [content, setContent] = useState("");
    const location = useLocation();

    const path = location.pathname.split("/")[3];
    const getPost = useCallback(async () => {
        const res = await axios.get(`/api/v1/posts/${path}`);
        setDataPost(res.data.post);
    }, [path]);
    useEffect(() => {
        if (dataPost.content) {
            dataPost.content.map((e) => setContent(e));
        }
    }, [dataPost]);
    useEffect(() => {
        if (content) {
            const editor = new EditorJS({
                holder: "editorjs",
                readOnly: false,
                tools: Config,
                data: content,
            });
            seteditor(editor);
        }
    }, [content]);
    const getCategories = useCallback(() => {
        dispatch(actions.getAllCategories.getAllCategoriesRequest());
    }, [dispatch]);
    useEffect(() => {
        getPost();
        getCategories();
    }, [getCategories, getPost]);
    const handleVisibleModal = useCallback(
        (e) => {
            e.preventDefault();
            editor
                .save()
                .then((outputData) => {
                    setData({ ...data, content: outputData });
                })
                .catch((error) => {
                    console.log("Saving failed: ", error);
                });
            setVisible(!visible);
        },
        [visible, editor, setData, data]
    );
    const onSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);
    const onSave = useCallback(
        async (e) => {
            e.preventDefault();
            if (dataPost._id) {
                const token = localStorage.getItem("token");
                const option = {
                    method: "put",
                    url: `/api/v1/posts/${dataPost._id}`,
                    data: data,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios(option);
                setSlug(response.data);
            }
        },
        [dataPost._id, data]
    );
    useEffect(() => {
        if (slug.data) {
            navigate(`/post/${slug.data.slug}`);
        }
    }, [navigate, slug.data]);
    return (
        <div className="mt-80">
            <div className="post">
                <form action="" method="POST" onSubmit={onSubmit}>
                    <div className="post__container">
                        <div
                            suppressContentEditableWarning
                            className="post__title"
                            ref={refEdit}
                            value={dataPost.title}
                            onInput={(e) =>
                                setData({
                                    ...data,
                                    title: e.currentTarget.textContent,
                                })
                            }
                        >
                            {dataPost.title}
                        </div>
                        <div className="post__content">
                            <div id="editorjs" />
                        </div>
                        <div className="post__button">
                            <button className="post__button-main border save">Lưu nháp</button>
                            <button className="post__button-main border next" onClick={handleVisibleModal}>
                                Bước tiếp theo
                            </button>
                        </div>
                    </div>
                    {visible && (
                        <div className="modal">
                            <div className="modal__container">
                                <div className="modal__content">
                                    <div className="modal__desc">
                                        <p className="modal__title">
                                            Mô tả bài viết
                                            <em className="modal__title-sub"> (không bắt buộc)</em>
                                        </p>
                                        <textarea
                                            className="modal__desc-input"
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    description: e.target.value,
                                                })
                                            }
                                        >
                                            {dataPost.description}
                                        </textarea>
                                    </div>
                                    <div className="modal__tagname">
                                        <p className="modal__title">
                                            Thêm thẻ tag
                                            <em className="modal__title-sub"> (tối đa 5 thẻ)</em>
                                        </p>
                                        <div className="modal__tagname-container">
                                            <div className="tagname__search">
                                                <i className="tagname__search-icon bx bx-search"></i>
                                                <input
                                                    type="text"
                                                    className="tagname__search-input"
                                                    placeholder="Tìm thẻ tag..."
                                                />
                                            </div>
                                            <div className="tagname__selected">
                                                <div className="tagname__selected-container">
                                                    <span className="tagname__selected-content name">KHOA HỌC</span>
                                                    <span className="tagname__selected-content quantity">1102</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal__category">
                                        <p className="modal__title">Chọn danh mục</p>
                                        <div className="modal__category-container">
                                            <select
                                                id="selected-id"
                                                className="modal__category-select"
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        category: e.target.value,
                                                    })
                                                }
                                            >
                                                <option
                                                    className="modal__category-option"
                                                    value={dataPost.category._id}
                                                    key={dataPost.category._id}
                                                >
                                                    {dataPost.category.name}
                                                </option>
                                                {categorise.data.map((e, i) => (
                                                    <option
                                                        value={e._id}
                                                        key={e._id}
                                                        className="modal__category-option"
                                                    >
                                                        {e.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="modal__category-icon">
                                                <i className="modal__category-icon-down bx bxs-chevron-down"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal__button">
                                        <button className="modal__button-content back" onClick={handleVisibleModal}>
                                            Quay lại
                                        </button>
                                        <Link to="/">
                                            <button
                                                onClick={onSave}
                                                type="submit"
                                                className="modal__button-content create"
                                            >
                                                Cập nhật
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
