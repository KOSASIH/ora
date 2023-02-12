import { INIT_STATE } from "../../constant";
import { getAllCategories, getType } from "../actions";
export default function categoriesReducers(state = INIT_STATE.categories, action) {
    switch (action.type) {
        case getType(getAllCategories.getAllCategoriesRequest):
            return {
                ...state,
                isLoading: true,
            };
        case getType(getAllCategories.getAllCategoriesSuccess):
            return {
                ...state,
                isLoading: false,
                data: action.payload,
            };
        case getType(getAllCategories.getAllCategoriesFailure):
            return {
                ...state,
                isLoading: false,
                err: action.payload,
            };
        default:
            return state;
    }
}
