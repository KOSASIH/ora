import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./trendingposts.scss";
const TrendingPosts = ({ posts, slidesToShow, slice }) => {
  const sliderSettings = {
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    infinite: false,
    speed: 500,
    lazyLoad: true,
  };
  return (
    <div className="user__profile-posts-trending">
      <div className="user__profile-posts-nav">
        <div className="user__profile-posts-arrow right">
          <i className="bx bx-right-arrow"></i>
        </div>
        <div className="user__profile-posts-arrow left">
          <i className="bx bx-left-arrow"></i>
        </div>
      </div>
      <div className="user__profile-posts-trending-wrapper">
        <Slider {...sliderSettings}>
          {posts.slice(0, slice).map((post) => (
                <div>
                <div className="pom__content-details">
                  <Link to="/">
                    <div className="mt-10">
                      <img
                        className="border-img trending-img"
                        src={
                          post.attachment
                            ? `https://${post.attachment}`
                            : "/images/home-bg.png"
                        }
                        alt=""
                      />
                    </div>
                  </Link>
                  <Link to={`/category/${post.category.slug}`}>
                    <p className="title-category mt-10">{post.category.name}</p>
                  </Link>
                  <Link to={`/post/${post.slug}`}>
                    <p className="title-post-sm mt-10">
                    {post.title}
                    </p>
                  </Link>
                  <Link  to={`/user/${post.author.userName}`}>
                    <p className="post-username mt-10">{post.author.displayName ? post.author.displayName : post.author.userName}</p>
                  </Link>
                </div>
              </div>
           ))}
      
        </Slider>
      </div>
    </div>
  );
};

export default TrendingPosts;
