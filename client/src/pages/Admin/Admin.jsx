import React, { useEffect,useState,useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import { allPostsState$ } from "../../redux/selectors";
import { Link } from "react-router-dom";
const Admin = () => {
    const dispatch = useDispatch();
    const posts = useSelector(allPostsState$);
    useEffect(() => {
        dispatch(actions.getAllPosts.getAllPostsRequest());
    }, [dispatch]);
    useEffect(() => {
        document.title = "Piora | Social Network for Pioneer";
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
   
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);
   
    let totalPosts = posts.data.length;
  const dataPost=posts;
  
     
    
    return (

        <main className="main">
            <p> Tổng cộng {totalPosts} bai viet</p>
             <div className="adv__widget-content">
                    {posts.data.slice(indexOfFirstPost, indexOfLastPost).map((post) => (
                        <div className="adv__widget-content-details">
                           
                            <div className="adv__widget-user">
                                <Link to={`/post/${post.slug} `}>
                                    <p className="post-title">{post.title}</p>
                                </Link>
                                <Link to={`/user/${post.author.userName} `}>
                                    <span className="username">
                                        {post.author.displayName ? post.author.displayName : post.author.userName}{" "}
                                    </span>
                                </Link>
                             
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-center'>
      
      <nav className='block'></nav>
      <div>
        <nav
          className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
          aria-label='Pagination'
        >
            
          <button
            onClick={() => {
               
              paginateBack();
            }}
            disabled={currentPage===1}
            className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
          >
            <span>Trước</span>
          </button>

          <button
            onClick={() => {
              paginateFront();
            }}
            disabled={currentPage * postsPerPage>=totalPosts}
            className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
          >
            <span>Tiếp</span>
          </button>
        </nav>
      </div>
    </div>
  
    </main>
    );


};
export default Admin;
