import { INIT_STATE } from "../../constant";
import { getAllPosts, getType,updatePost, deletePost} from "../actions";
export default function allPostsReducers(state = INIT_STATE.allPosts,action){
    switch(action.type) {
        case getType(getAllPosts.getAllPostsRequest):
            return {
                ...state,
                isLoading:true,
            }
        case getType(getAllPosts.getAllPostsSuccess):
            return {
                ...state,
                isLoading:false,
                data: action.payload,
                // post:action.payload
            }
        case getType(getAllPosts.getAllPostsFailure):
            return {
                ...state,
                isLoading:false,
            }
        case getType(updatePost.updatePostSuccess):
            return {
              ...state,
                data: state.data.map(post => post._id === action.payload._id ? action.payload : post)
            };
        case getType(deletePost.deletePostSuccess):
            return {
              ...state,
                data: state.data.filter(post => post._id !== action.payload._id)
            };
        default:
            return state;
    } 
}