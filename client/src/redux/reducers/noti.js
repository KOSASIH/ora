import { INIT_STATE } from "../../constant";
import { getNotifications, getType} from "../actions";
export default function notiReducers(state = INIT_STATE.noti,action){
    switch(action.type) {
        case getType(getNotifications.getNotificationsRequest):
            return {
                ...state,
                isLoading:false,
            }
        case getType(getNotifications.getNotificationsSuccess):
            return {
                isLoading:true,
                data: action.payload,  
            }
        case getType(getNotifications.getNotificationsFailure):
            return {
                isLoading:false,
                err:action.payload
            }
        default:
            return state;
    } 
}