import React, { useCallback, useRef, useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import { Link, useNavigate } from "react-router-dom";
import * as actions from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { postState$, categoriesState$, userState$} from "../../redux/selectors";
import axios from "axios";
import config from "./tools";
import "./createpost.scss";
import { useTranslation } from "react-i18next";
const CreatePost = () => {
    const { t } = useTranslation();
    const post = useSelector(postState$);
    const toast = useRef(null);
    const categorise = useSelector(categoriesState$);
    const currentUser = useSelector(userState$);
    const isBlockAll = currentUser?.currentUser?.isBlockedAll;

    console.log("Blocked?", isBlockAll);
    const dispatch = useDispatch();
    const [editor, seteditor] = useState({});
    const [error, setError] = useState(null);
    const refEdit = useRef();
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: "",
        content: "",
        description: "",
        category: "64d95dea763ef48b32485fb7",
        attachment: "",
    });
    useEffect(() => {
        const editor = new EditorJS(config());
        seteditor(editor);
    }, []);
    const getCategories = useCallback(() => {
        dispatch(actions.getAllCategories.getAllCategoriesRequest());
    }, [dispatch]);
    useEffect(() => {
        getCategories();
    }, [getCategories]);
    // const editorJS = new EditorJS({
    //   onChange: async () => {
    //     const data = await editorJS.save();
    //     if (!equal(prevEditorJSData?.blocks, data.blocks)) {
    //
    //     }

    //     prevEditorJSData = data;
    //   },
    // });
    const handleVisibleModal = useCallback(
        (e) => {
            setError(null);
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
        [visible, editor, data]
    );
    const onSave = useCallback(
        (e) => {
            try {
                e.preventDefault();
                dispatch(actions.createPost.createPostRequest(data));
            } catch (err) {
                dispatch(actions.createPost.createPostFailure());
            }
        },
        [data, dispatch]
    );
    const onSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);
    const createPostNotofication = useCallback(async () => {
        if (post.isLoading) {
            const token = localStorage.getItem("token");
            try {
                const option = {
                    method: "post",
                    url: `/api/v1/notifications/`,
                    data: {
                        postId: post.post.data.id,
                    },
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                };
                await axios(option);
                navigate(`/post/${post.post.data.slug}`);
            } catch (err) {}
        }
        if (post.err) {
            setError(post.err);
        }
    }, [post, navigate]);
    useEffect(() => {
        createPostNotofication();
    }, [createPostNotofication]);
    useEffect(() => {
        const timer = setTimeout(() => {
            toast.current.style.animation = "hide_slide 1s ease forwards";
        }, 4000);
        return () => clearTimeout(timer);
    }, [error]);
    useEffect(() => {
        document.title = "Write new post...";
    }, []);

  
   return  (
        <div className="mt-80">
                {isBlockAll ? ( <div className="block"><h2>You have been blocked</h2>
                                                        </div>

                                                          ) :(
                                                            <div className="post">
                                                            <form action="" method="POST" onSubmit={onSubmit}>
                                                                <div className="post__container">
                                                                    <div
                                                                        suppressContentEditableWarning
                                                                        placeholder={t("_YOUR_TITLE_HERE_")}
                                                                        className="post__title"
                                                                        ref={refEdit}
                                                                        value={data.title}
                                                                        onInput={(e) =>
                                                                            setData({
                                                                                ...data,
                                                                                title: e.currentTarget.textContent,
                                                                            })
                                                                        }
                                                                    ></div>
                                                                    <div className="post__content">
                                                                        <div id="editorjs" />
                                                                    </div>
                                                                    <div className="post__button">
                                                                        <Link to="/">
                                                                            <button className="post__button-main border save">{t("back")}</button>
                                                                        </Link>
                                            
                                                                        <button className="post__button-main border next" onClick={handleVisibleModal}>
                                                                            {t("next")}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {visible && (
                                                                    <div className="modal">
                                                                        <div className="modal__container">
                                                                            {error ? (
                                                                                <div className="toast-mess-container">
                                                                                    <button ref={toast} className={`alert-toast-message err`}>
                                                                                        {error}
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            <div className="modal__content">
                                                                                <div className="modal__desc">
                                                                                    <p className="modal__title">
                                                                                        {t("description")}
                                                                                        <em className="modal__title-sub"> ({t("option")})</em>
                                                                                    </p>
                                                                                    <textarea
                                                                                        className="modal__desc-input"
                                                                                        value={data.description}
                                                                                        onChange={(e) =>
                                                                                            setData({
                                                                                                ...data,
                                                                                                description: e.target.value,
                                                                                            })
                                                                                        }
                                                                                    ></textarea>
                                                                                </div>
                                                                                <div className="modal__category">
                                                                                    <p className="modal__title">{t("category")}</p>
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
                                                                                            <option className="modal__category-option">-- {t("require")} --</option>
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
                                                                                        {t("back")}
                                                                                    </button>
                                                                                    <Link to="/">
                                                                                        <button
                                                                                            onClick={onSave}
                                                                                            type="submit"
                                                                                            className="modal__button-content create"
                                                                                        >
                                                                                            {t("save")}
                                                                                        </button>
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </form>
                                                        </div>
                                                
                                                          )} 
           
        </div> );
    
};

export default CreatePost;
