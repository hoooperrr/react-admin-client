import {applyMiddleware, createStore} from 'redux'
import reducers from "./reducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension'

export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))