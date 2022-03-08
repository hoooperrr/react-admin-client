import {combineReducers} from "redux";
import storageUtils from "../utils/storageUtils";
import {RECEIVE_USER, RESET_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG,} from "./action-types";

const initialHeadTitle = '首页'

function headTitle(state = initialHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

const initialUser = storageUtils.getUser()

function user(state = initialUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.data
        case SHOW_ERROR_MSG:
            return {...state, errorMsg: action.data}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

export default combineReducers({headTitle, user})