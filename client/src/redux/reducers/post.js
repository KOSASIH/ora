import { INIT_STATE } from "../../constant";
import { getType, getPost, createPost } from "../actions";

export default function postReducers(state = INIT_STATE.post, action) {
    switch (action.type) {
        case getType(getPost.getPostRequest):
            return {
                ...state,
                isLoading: true,
            };
        case getType(getPost.getPostSuccess):
            return {
                ...state,
                isLoading: false,
                post: action.payload,
            };
        case getType(getPost.getPostFailure):
            return {
                ...state,
                isLoading: false,
                err: action.payload,
            };

        case getType(createPost.createPostRequest):
            return {
                //   post:null,
                ...state,
                isLoading: false,
                //   data: [...state.data, action.payload],
            };
        case getType(createPost.createPostSuccess):
            return {
                ...state,
                isLoading: true,
                post: action.payload,
                //   data: [...state.data, action.payload],
            };
        case getType(createPost.createPostFailure):
            return {
                //   ...state,
                //   data: [...state.data, action.payload],
                ...state,
                isLoading: false,
                err: action.payload,
                //   isLoading:true,
            };
        default:
            return state;
    }
}
