import { combineReducers } from 'redux'
import windowReducer from './window'

const rootReducer = combineReducers({
  window: windowReducer,
})

export default rootReducer
