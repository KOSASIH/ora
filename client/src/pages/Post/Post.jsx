import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate,useSearchParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import "./post.scss";
import axios from "axios";
import { Config } from "./tools";
import { userState$, postState$ } from "../../redux/selectors";
import { useSelector } from "react-redux";
import Comment from "../../components/Comment/Comment";
import { FacebookIcon, FacebookShareButton } from 'react-share';
import {donatePi} from '../../components/pisdk/pisdk.tsx'
const Post = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const notiId = searchParams.get('notiId')
  const post = useSelector(postState$);
  const inputCmtRef = useRef(null)
  const toast = useRef(null);
  const [voteCount, setVoteCount] = useState(null);
  const [voteCountUpdate, setVoteCountUpdate] = useState([]);
  const [isSuccess, setIsSuccess] = useState(null);
  const currentUser = useSelector(userState$);
  const location = useLocation();
  const [isUser, setIsUser] = useState(false);
  const [visiable, setVisiable] = useState(false);
  const [dataPost, setDataPost] = useState({});
  const [categoryPost, setCategoryPost] = useState({});
  const [authPost, setAuthPost] = useState({});
  const [content, setContent] = useState("");
  const [active, setActive] = useState();
  const [activeCate, setActiveCate] = useState(false);
  const [response, setResponse] = useState(null);
  const [dataComment, setDataComment] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(null);
  const [isVote, setIsVote] = useState(false);
  const [isUnVote, setIsUnVote] = useState(false);
  const path = location.pathname.split("/")[2];
  const getPost = useCallback(async () => {
    const res = await axios.get(`/api/v1/posts/${path}`);
    setDataPost(res.data.post);
    setAuthPost(res.data.post.author);
    setCategoryPost(res.data.post.category);
    setVoteCount(res.data.points)
  }, [path]);
  useEffect(() => {
    getPost();
  }, [getPost]);
  useEffect(() => {
    if (post.post) {
      if (post.post.data) {
        setIsSuccess(post.post.data.status);
      }
    }
  }, [post]);

  const handleVote = useCallback(
    async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const option = {
        method: "post",
        url: `/api/v1/posts/vote`,
        data: {
          "postId" : dataPost._id,
          "action" : "1"
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }; 
      const res = await axios(option);
      setIsVote(!isVote)
      setIsUnVote(false);
      setVoteCountUpdate(res.data.points)
    },
    [dataPost._id, isVote]
  );
  const tip = useCallback( async (e) => {
    e.preventDefault();
    donatePi("Tip Post", 1, {To: "Piora"})
  
    // const option  ={
    //   method: "post", 
    //   url:``,
    //   data: ''
    // }
    

  //   const response = await axios(option)
  //   setMessages(response.data.data)
  //  if (response.data.status=='OK') setVisible(!visible)
  //   setErr(false)
  },[])

  const handleUnVote = useCallback(
    async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const option = {
        method: "post",
        url: `/api/v1/posts/vote`,
        data: {
          "postId" : dataPost._id,
          "action" : "2"
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }; 
      const res = await axios(option);
      setIsUnVote(!isUnVote)
      setIsVote(false)
      setVoteCountUpdate(res.data.points)
    },
    [dataPost._id, isUnVote]
  );
  const shareUrl = `http://192.168.1.145:3000/post/${dataPost?.slug}`
  useEffect(() => {
    if (dataPost.content) {
      dataPost.content.map((e) => setContent(e));
    }
  }, [dataPost]);
  useEffect(() => {
    if (content) {
      const editor = new EditorJS({
        holder: "editorjs",
        readOnly: true,
        tools: Config,
        data: content,
      });
    }
  }, [dataPost, content]);
  useEffect(() => {
    if (currentUser.currentUser) {
      if (authPost._id === currentUser.currentUser._id) {
        setIsUser(true);
      }
    }
  }, [authPost, currentUser]);
  const handleClickDelete = () => setVisiable(!visiable);
  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const option = {
        method: "delete",
        url: `/api/v1/posts/${dataPost._id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res = await axios(option);
      setResponse(res.data);
    },
    [dataPost._id]
  );
  useEffect(() => {
    if (response) {
      if (response.message) {
        window.location.href = "/";
      }
    }
  }, [navigate, response]);
  const handleUnFlow = useCallback(
    async (e) => {
      const token = localStorage.getItem("token");
      try {
        e.preventDefault();
        const option = {
          method: "put",
          url: `/api/v1/auth/update/unfollower/`,
          data:[authPost._id],
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios(option);
        setActive(false)
      } catch (err) {}
    },
    [authPost._id]
  );
  const handleFlow = useCallback(
    async (e) => {
      const token = localStorage.getItem("token");
      try {
        e.preventDefault();
        const option = {
          method: "put",
          url: `/api/v1/auth/update/follower/`,
          data: [authPost._id],
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios(option);
        setActive(true)
      } catch (err) {}
    },
    [authPost._id]
  );
  const handleFlowCategory = useCallback(
    async (e) => {
      const token = localStorage.getItem("token");
      try {
        e.preventDefault();
        const option = {
          method: "put",
          url: `/api/v1/auth/create/category`,
          data:[categoryPost._id],
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios(option);
        setActiveCate(true)
      } catch (err) {}
    },
    [categoryPost._id]
  );
  const handleUnFlowCategory = useCallback(
    async (e) => {
      const token = localStorage.getItem("token");
      try {
        e.preventDefault();
        const option = {
          method: "put",
          url: `/api/v1/auth/delete/category`,
          data:[categoryPost._id],
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios(option);
        setActiveCate(false)
      } catch (err) {}
    },
    [categoryPost._id]
  );
  const handleSubmitComment = useCallback( async(e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try{
      const option = {
        method: "post",
        url: `/api/v1/comment/create`,
        data:{
          content : dataComment.content,
          "postId" : dataPost._id
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res = await axios(option);
      setNewComment(res.data.data)
      setDataComment({content:""})
    }
    catch(err){}
  },[dataComment,dataPost])
  const getAllComments = useCallback( async() => {
    if(dataPost._id){
      try{
        const option = {
          method: "get",
          url: `/api/v1/comment/${dataPost._id}`,
        };
        const res = await axios(option);
        setComments(res.data.data.comments)
      }
      catch(err){
        
      }
    }
  },[dataPost._id])
  useEffect(() => {
    getAllComments()
    if(newComment) {
      getAllComments()
    }
  },[getAllComments,newComment])
  useEffect(() => {
    if(currentUser.currentUser){
      if(currentUser.currentUser.following.includes(authPost._id)){
        setActive(true)
      }
      else{
        setActive(false)
      }
    }
  },[authPost,currentUser])
  useEffect(() => {
    if(currentUser.currentUser){
      if(currentUser.currentUser.category.find((e) => e._id === categoryPost._id)){
          setActiveCate(true)
      }
      else{
          setActiveCate(false)
      }
    }
  },[categoryPost,currentUser])
  const updateView = useCallback(async (e) => {
    if(dataPost._id) {
      const token = localStorage.getItem("token");
      const option = {
        method: "post",
        url: `/api/v1/posts/views`,
        data: {
          "postId" : dataPost._id,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }; 
      await axios(option);
    }
    },[dataPost._id]);
  useEffect(() => {
    updateView()
  },[updateView])
  const updateNoti = useCallback(async (e) => {
    if(notiId) {
      const token = localStorage.getItem("token");
      const option = {
        method: "put",
        url: `/api/v1/notifications/read`,
        data: {
          "notificationID" :notiId,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }; 
      await axios(option);
    }
    },[notiId]);
  useEffect(() => {
    updateNoti()
  },[updateNoti])
  useEffect(() => {
    const timer = setTimeout(() => {
      // toast.current.style.animation = "hide_slide 1s ease forwards";
    }, 4000);
    return () => clearTimeout(timer);
  }, [isSuccess]);
  useEffect(() => {
     if(dataPost){
      document.title = dataPost.title
     }
  }, [dataPost]);
  useEffect(() => {
    if(voteCountUpdate || voteCountUpdate === 0){
      setVoteCount(voteCountUpdate)
    }
  },[voteCountUpdate,getPost])

  useEffect(() => {
    if (!isUser) {
      setIsUnVote(true)
      console.log("Not a User")
    }
    else if(dataPost.unVote?.includes(currentUser?.currentUser._id)){
      setIsUnVote(true)
    }
    
    else if (dataPost.vote?.includes(currentUser?.currentUser._id)){
      setIsVote(true)
    }
  },[currentUser,dataPost])
  return (
    <div className="mt-80">
      <div className="post__details-container">
        {isSuccess ? (
          <div className="toast-mess-container">
            <button  ref={toast} className={`alert-toast-message success`}>{isSuccess}</button>
          </div>
        ) : (
          ""
        )}
        <div className="post__details-auth">
          <div className="post__details-category">
            <Link to={`/category/${categoryPost.slug}`}>
              <span className="post__details-category-name">
                {categoryPost.name}
              </span>
            </Link>
          </div>
          <div className="post__details-title">
            <h1>{dataPost.title}</h1>
          </div>
          <div className="post__details-desc">
            <p>{dataPost.description}</p>
          </div>
          <div className="post__details mt-20 flex-box">
            <div className="flex-align-gap-10">
              <div className="post-avt-div">
                <Link to={`/user/${authPost.userName}`}>
                  <img
                    src={
                      authPost.avatar
                        ? `https://${authPost.avatar.slice(7)}`
                        : "/icons/avatar.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
              <div>
                <Link to={`/user/${authPost.userName}`}>
                  <p className="post-username">
                    {authPost.displayName
                      ? authPost.displayName
                      : authPost.userName}
                  </p>
                </Link>
              </div>
            </div>
            {isUser ? (
              <div className="flex-align-gap-10">
                <Link to={`/post/update/${path}`}>
                  <span className="button-data edit">Edit</span>
                </Link>
                <button className="btn-delete" onClick={handleClickDelete}>
                  <span className="button-data delete">Delete</span>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="post__details-content">
          <div className="post__details-content-container">
            <div id="editorjs" />
          </div>
          <div className="sticky-bar"></div>
        </div>
        <div className="post__tool-bar">
          <div className="pull-left">
            <div className="vote">
              <div className="upvote" onClick={handleVote}>
                <div>
                  {isVote? (
                    <i className='vote-icon bx bxs-up-arrow like' ></i> 
                  ): (
                    <i className='bx bx-up-arrow'></i>
                  )}               
                </div>
              </div>              
              <span className="value">{voteCount}</span>
              <div className="upvote" onClick={handleUnVote}>
                <div>
                {isUnVote ? (
                    <i className='vote-icon bx bxs-up-arrow bx-rotate-180 dislike'></i> 
                  ): (
                    <i className='bx bx-up-arrow bx-rotate-180' ></i>
                  )}       
                </div>
              </div>
            </div>
            <div className="view-count">{dataPost.views} views</div>
            <div className="tip-post" onClick={tip}><i className="bx bx-donate-heart  adv__donate-icon"></i></div>

          </div>
          <div className="pull-right">
            <div className="right-tools">
              <Link to="/" className="tool">
                <FacebookShareButton url={shareUrl}>
                    <FacebookIcon size={40} round={true}></FacebookIcon>
                  </FacebookShareButton>
              </Link>
              <div className="bookmark">
                <Link to="/" title="Click to save post">
                  <i className="bx bx-bookmarks"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="post__subscription">
          <div className="post__author">
            <div className="post__author-container">
              <div className="post__author-infos">
                <div className="post__author-avt">
                  <Link to={`/user/${authPost.userName}`}>
                  <img
                    src={
                      authPost.avatar
                        ? `https://${authPost.avatar.slice(7)}`
                        : "/icons/avatar.png"
                    }
                    alt=""
                  />
                  </Link>
                </div>
                <div className="name">
                  <Link  to={`/user/${authPost.userName}`} className="name-main">
                  {authPost.displayName
                      ? authPost.displayName
                      : authPost.userName}
                  </Link>
                  <p>@{authPost.userName}</p>
                </div>
              </div>
              <div className="sub-container">
                {
                  currentUser.currentUser?._id === authPost?._id ? "" : (
                    active ? (
                      <button className="btn-fl followed" onClick={handleUnFlow}>Following</button>
                     
                    ) : (
                      <button className="btn-fl follow" onClick={handleFlow}>Follow</button>  
                    )
                  )
                }
              </div>
            </div>
            <div className="user-desc">{authPost.intro}</div>
          </div>
          <div className="category__item">
            <div className="catergory__info">
              <Link className="name-main" to={`/category/${categoryPost.slug}`}>
                <span>{categoryPost.name}</span>
              </Link>
              <p>/{categoryPost.slug}</p>
            </div>
              {
                  activeCate ? (
                    <button className="btn-fl followed" onClick={handleUnFlowCategory}>Following</button>                  
                  ) : (
                    <button className="btn-fl follow" onClick={handleFlowCategory}>Follow</button>  
                  )
                }
          </div>
        </div>
        <div className="comment__container">
          <section className="comment__section">
            <div>
              <div className="comment__form-container">
                <form  className="comment__form"  ref={inputCmtRef}>
                  <input
                    className="comment__form-data"
                    ref={inputCmtRef}     
                    placeholder="Comment this post"
                    value={dataComment.content}
                    onChange={(e) => setDataComment({ ...dataComment, content: e.target.value })}
                  ></input>
                  <div className="comment__form-actions" onClick={handleSubmitComment}>
                    <div className="comment__form-actions-submit" >Send</div>
                  </div>
                </form>
              </div>
            </div>
            <div className="comment__nav-tab">
              <div className="separator"></div>
              <ul className="comment__nav-list">
                <li className="comment__nav-item active">
                  <Link to="/">Hot</Link>
                </li>
                <li className="comment__nav-item">
                  <Link to="/">New</Link>
                </li>
              </ul>
            </div>
            <div className="comment__tree-view">
              <div className="comments">
                <div className="comments__node">
                  {comments.length > 0  ? (
                    comments.map((comment) => (
                      <Comment postId={dataPost?._id} comment={comment} key={comment._id} />
                    ))
                  ) : ""}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {visiable ? (
        <div className="modal__delete">
          <div className="modal__delete-container">
            <div className="modal__delete-main">
              <header className="modal__delete-header">Delete</header>
              <main className="modal__delete-content">
               Do you want to delete post?
              </main>
              <footer className="modal__delete-footer">
                <button
                  onClick={handleDelete}
                  className="modal__delete-button delete"
                >
                  DELETE?
                </button>
                <button
                  onClick={handleClickDelete}
                  className="modal__delete-button cancle"
                >
                  Cancel
                </button>
              </footer>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Post;
