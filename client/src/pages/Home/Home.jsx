import React, { useEffect, useState } from "react";
import Suggest from "../../components/Suggest/Suggest";
import Adv from "../../components/Adv/Adv";
import Filter from "../../components/Filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import { allPostsState$ } from "../../redux/selectors";

const Home = () => {
    const [postsByCate] = useState(null);
    const dispatch = useDispatch();
    const posts = useSelector(allPostsState$);
    useEffect(() => {
        dispatch(actions.getAllPosts.getAllPostsRequest());
    }, [dispatch]);
    // const getPostSaved = useCallback( async (e) => {
    //   const token = localStorage.getItem("token");
    //   try{
    //     const option = {
    //       method: "get",
    //      ủl
    //       headers: {
    //         authorization: `Bearer ${token}`,
    //       },
    //     };
    //     const response = await axios(option);
    //     setPostsByCate(response.data);
    //   }
    //   catch(err){

    //   }
    // },[])
    // useEffect(() => {
    //   getPostSaved()
    // },[getPostSaved])
    useEffect(() => {
        document.title = "Piora | Social Network for Pioneer";
    }, []);
    return (
        <main className="main">
            <div className="container">
                <Suggest />
                <div className="grid">
                    <div className="row">
                        <div className="col l-8">
                            {postsByCate ? (
                                <Filter posts={postsByCate ? postsByCate.data : ""} />
                            ) : (
                                <Filter posts={posts.data} />
                            )}
                        </div>
                        <div className="col l-4">
                            <Adv />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
