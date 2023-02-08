export const INIT_STATE = {
    allPosts: {
        isLoading: false,
        data: [],
        err: null,
        // post: null,
    },
    categories: {
        isLoading: false,
        data: [],
        err: null,
    },
    auth: {
        isLoggedIn: false,
        currentUser: null,
        err: null,
        token: false,
        categoryUser: false,
        isUpdated:false,
    },
    post: {
        post: null,
        isLoading: false,
        err: null,
    },
    categoryUser:{
        isLoading: false,
        err: null,
        data: [],
    },
    password:{
        isLoading:false,
        data:null,
        err:null
    },
    noti : {
        isLoading:false,
        isRead: false,
        data:null,
        err:null
    }
}