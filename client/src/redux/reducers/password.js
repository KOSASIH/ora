import { INIT_STATE } from "../../constant";
import { userUpdatePassword, getType } from "../actions";
export default function passwordReducers(state = INIT_STATE.password, action) {
    switch (action.type) {
        case getType(userUpdatePassword.userUpdatePasswordRequest):
            return {
                ...state,
                isLoading: false,
            };
        case getType(userUpdatePassword.userUpdatePasswordSuccess):
            return {
                isLoading: true,
                data: action.payload,
                err: null,
            };
        case getType(userUpdatePassword.userUpdatePasswordFailure):
            return {
                isLoading: false,
                data: null,
                err: action.payload,
            };
        default:
            return state;
    }
}
