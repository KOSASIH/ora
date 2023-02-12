import { INIT_STATE } from "../../constant";
import {
    getType,
    login,
    logout,
    register,
    checkCurrentUser,
    createCategoryUser,
    userUpdate,
    registerWithFacebook,
} from "../actions";
export default function userReducers(state = INIT_STATE.auth, action) {
    switch (action.type) {
        case getType(login.loginRequest):
            return {
                isLoggedIn: false,
            };
        case getType(login.loginSuccess):
            return {
                token: action.payload.data.token,
                isLoggedIn: true,
                currentUser: action.payload,
            };
        case getType(login.loginFailure):
            return {
                isLoggedIn: false,
                err: action.payload,
            };
        case getType(userUpdate.userUpdateRequest):
            return {
                ...state,
                isUpdated: false,
            };
        case getType(userUpdate.userUpdateSuccess):
            return {
                ...state,
                isUpdated: true,
            };
        case getType(userUpdate.userUpdateFailure):
            return {
                ...state,
                isUpdated: false,
            };
        case getType(register.registerRequest):
            return {
                isLoggedIn: false,
            };
        case getType(register.registerSuccess):
            return {
                isLoggedIn: true,
                currentUser: action.payload,
                token: action.payload.data.token,
            };
        case getType(register.registerFailure):
            return {
                isLoggedIn: false,
                err: action.payload,
            };
        case getType(checkCurrentUser.checkCurrentUserRequest):
            return {
                ...state,
                isLoggedIn: true,
                currentUser: action.payload,
            };
        case getType(checkCurrentUser.checkCurrentUserSuccess):
            return {
                ...state,
                isLoggedIn: false,
                currentUser: action.payload,
            };
        case getType(checkCurrentUser.checkCurrentUserFailure):
            return {
                ...state,
                isLoggedIn: true,
                currentUser: action.payload,
            };
        case getType(createCategoryUser.createCategoryUserRequest):
            return {
                ...state,
            };
        case getType(createCategoryUser.createCategoryUserSuccess):
            return {
                ...state,
                categoryUser: true,
            };
        case getType(createCategoryUser.createCategoryUserFailure):
            return {
                ...state,
                err: action.payload,
            };

        case getType(registerWithFacebook.registerWithFacebookRequest):
            return {
                isLoggedIn: false,
            };
        case getType(registerWithFacebook.registerWithFacebookSuccess):
            return {
                isLoggedIn: true,
            };
        case getType(registerWithFacebook.registerWithFacebookFailure):
            return {
                isLoggedIn: false,
                err: action.payload,
            };

        case getType(logout):
            return {
                isLoggedIn: true,
                token: false,
                currentUser: null,
                err: null,
            };
        default:
            return state;
    }
}
