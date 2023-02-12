import { createActions, createAction } from "redux-actions";
export const getType = (reduxAction) => {
    return reduxAction().type;
};
// POSTS
export const getAllPosts = createActions({
    getAllPostsRequest: undefined,
    getAllPostsSuccess: (payload) => payload,
    getAllPostsFailure: (err) => err,
});

export const getPost = createActions({
    getPostRequest: undefined,
    getPostSuccess: (payload) => payload,
    getPostFailure: (err) => err,
});
export const getNotifications = createActions({
    getNotificationsRequest: undefined,
    getNotificationsSuccess: (payload) => payload,
    getNotificationsFailure: (err) => err,
});

export const deletePost = createActions({
    deletePostRequest: (payload) => payload,
    deletePostSuccess: (payload) => payload,
    deletePostFailure: (err) => err,
});

export const createPost = createActions({
    createPostRequest: (payload) => payload,
    createPostSuccess: (payload) => payload,
    createPostFailure: (err) => err,
});
export const updatePost = createActions({
    updatePostRequest: (payload) => payload,
    updatePostSuccess: (payload) => payload,
    updatePostFailure: (err) => err,
});

// AUTH
export const login = createActions({
    loginRequest: (payload) => payload,
    loginPiRequest: (payload) => payload,
    loginSuccess: (payload) => payload,
    loginFailure: (err) => err,
});
export const registerWithFacebook = createActions({
    registerWithFacebookRequest: (payload) => payload,
    registerWithFacebookSuccess: (payload) => payload,
    registerWithFacebookFailure: (err) => err,
});
export const register = createActions({
    registerRequest: (payload) => payload,
    registerSuccess: (payload) => payload,
    registerFailure: (err) => err,
});
export const userUpdate = createActions({
    userUpdateRequest: (payload) => payload,
    userUpdateSuccess: (payload) => payload,
    userUpdateFailure: (err) => err,
});
export const userUpdatePassword = createActions({
    userUpdatePasswordRequest: (payload) => payload,
    userUpdatePasswordSuccess: (payload) => payload,
    userUpdatePasswordFailure: (err) => err,
});
export const checkCurrentUser = createActions({
    checkCurrentUserRequest: undefined,
    checkCurrentUserSuccess: (payload) => payload,
    checkCurrentUserFailure: (err) => err,
});
export const createCategoryUser = createActions({
    createCategoryUserRequest: (payload) => payload,
    createCategoryUserSuccess: (payload) => payload,
    createCategoryUserFailure: (err) => err,
});
export const deleteCategoryUser = createActions({
    deleteCategoryUserRequest: (payload) => payload,
    deleteCategoryUserSuccess: (payload) => payload,
    deleteCategoryUserFailure: (err) => err,
});

// CATEGORISE
export const getAllCategories = createActions({
    getAllCategoriesRequest: undefined,
    getAllCategoriesSuccess: (payload) => payload,
    getAllCategoriesFailure: (err) => err,
});

export const logout = createAction("LOG_OUT");
export const showModal = createAction("SHOW_CREATE_POST_MODAL");
export const hideModal = createAction("HIDE_CREATE_POST_MODAL");
