import { takeLatest, call, put} from 'redux-saga/effects'
import * as actions from '../actions'
import * as api from '../../api'

// POSTS SAGA
function* getAllPostsSaga(action) {
  try {
    const posts = yield call(api.getAllPosts);
    yield put(actions.getAllPosts.getAllPostsSuccess(posts.data.data.posts))
  }catch(err){ 
      yield put(action.getPosts.getAllPostsFailure(err))
  }
}
function* getPostSaga(action) {
  const id = action
  console.log(id)
  try {
    const post = yield call(api.getPost);
    yield put(actions.getPost.getPostSuccess(post.data.data.posts))
  }catch(err){ 
      yield put(actions.getPost.getPostFailure(err))
  }
}
function* createPostSaga(action) {
  try {
    const post = yield call(api.createPost, action.payload);
    yield put(actions.createPost.createPostSuccess(post.data));
  } catch (err) {
    yield put(actions.createPost.createPostFailure(err.response.data.err));
  }
}
function* updatePostSaga(action) {
  try {
    const updatedpost = yield call(api.updatePost, action.payload);
    yield put(actions.updatePost.updatePostSuccess(updatedpost.data));
  } catch (err) {
    yield put(actions.updatePost.updatePostFailure(err));
  }
}

// AUTH SAGA
function* loginSaga(action) {
  try {
    const currentuser = yield call(api.login, action.payload);
    yield put(actions.login.loginSuccess(currentuser.data));
  } catch (error) {
    yield put(actions.login.loginFailure(error.response.data.message));
    console.log(error.response.data.message)
  }
}
function* registerSaga(action) {
  try {
    const register = yield call(api.register, action.payload);
    yield put(actions.register.registerSuccess(register.data));
    const currentuser = yield call(api.login, action.payload);
    yield put(actions.login.loginSuccess(currentuser.data));
  } catch (err) {
    yield put(actions.register.registerFailure(err.response.data.message));
  }
}
function* registerWithFacebookSaga (action) {
  try {
    const register = yield call(api.registerWithFacebook, action.payload);
    yield put(actions.register.registerWithFacebookSuccess(register));
    console.log(register)
    // const currentuser = yield call(api.login, action.payload);
    // yield put(actions.login.loginSuccess(currentuser.data));
  } catch (err) {
    yield put(actions.register.registerWithFacebookFailure(err.response));
  }
}

function* userUpdateSaga(action) {
  try {
    const user = yield call(api.userUpdate, action.payload);
    yield put(actions.userUpdate.userUpdateSuccess(user.data));
  } catch (err) {
    yield put(actions.userUpdate.userUpdateFailure(err.response.data.message));
    console.log(err.response.data.message)
  }
}
function* userUpdatePasswordSaga(action) {
  try {
    const user = yield call(api.userUpdatePassword, action.payload);
    yield put(actions.userUpdatePassword.userUpdatePasswordSuccess(user.data));
  } catch (err) {
    yield put(actions.userUpdatePassword.userUpdatePasswordFailure(err.response.data.message));
  }
}

function* checkCurrentUserSaga(action) {
  try {
    const checkCurrentUser = yield call(api.checkCurrentUser, action.payload);
    yield put(actions.checkCurrentUser.checkCurrentUserSuccess(checkCurrentUser.data.data.user));
  } catch (err) {
    yield put(actions.checkCurrentUser.checkCurrentUserFailure(err.response));
  }
}
function* createCategoryUserSaga(action) {
  try {
    const createCategoryUser = yield call(api.createCategoryUser, action.payload);
    yield put(actions.createCategoryUser.createCategoryUserSuccess(createCategoryUser.data));
  } catch (err) {
    yield put(actions.createCategoryUser.createCategoryUserFailure(err));
  }
}
function* deleteCategoryUserSaga(action) {
  try {
    const deleteCategoryUser = yield call(api.deleteCategoryUser, action.payload);
    yield put(actions.deleteCategoryUser.deleteCategoryUserSuccess(deleteCategoryUser.data));
  } catch (err) {
    yield put(actions.deleteCategoryUser.deleteCategoryUserFailure(err));
  }
}

// CATEGORISE SAGA 
function* getAllCategoriesSaga(action) {
  try {
    const categories = yield call(api.getAllCategories);
    yield put(actions.getAllCategories.getAllCategoriesSuccess(categories.data))
  }catch(err){ 
      yield put(actions.getAllCategories.getAllCategoriesFailure(err))
  }
}
// noti 
function* getNotificationsSaga(action) {
  try { 
    const noti = yield call(api.getAllNotifications);
    yield put(actions.getNotifications.getNotificationsSuccess(noti.data.data))
  }catch(err){ 
      yield put(actions.getNotifications.getNotificationsFailure(err))
  }
}

function* mySaga(){
  // POSTS
  yield takeLatest(actions.getAllPosts.getAllPostsRequest, getAllPostsSaga);
  yield takeLatest(actions.getPost.getPostRequest, getPostSaga);
  yield takeLatest(actions.createPost.createPostRequest, createPostSaga);
  yield takeLatest(actions.updatePost.updatePostRequest, updatePostSaga);
  // AUTH
  yield takeLatest(actions.login.loginRequest, loginSaga);
  yield takeLatest(actions.register.registerRequest, registerSaga);
  yield takeLatest(actions.registerWithFacebook.registerWithFacebookRequest,registerWithFacebookSaga);
  yield takeLatest(actions.userUpdate.userUpdateRequest, userUpdateSaga);  
  yield takeLatest(actions.userUpdatePassword.userUpdatePasswordRequest, userUpdatePasswordSaga);
  yield takeLatest(actions.checkCurrentUser.checkCurrentUserRequest, checkCurrentUserSaga);
  yield takeLatest(actions.createCategoryUser.createCategoryUserRequest, createCategoryUserSaga);
  yield takeLatest(actions.deleteCategoryUser.deleteCategoryUserRequest, deleteCategoryUserSaga);

  // CATEGORIES
  yield takeLatest(actions.getAllCategories.getAllCategoriesRequest, getAllCategoriesSaga);

  // NOTI
  yield takeLatest(actions.getNotifications.getNotificationsRequest, getNotificationsSaga);
}
export default mySaga;