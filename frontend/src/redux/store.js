import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productSlice from "./productSlice"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import userReducer from './userSlice'


// ✅ custom storage (jo tumne banaya)
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value)
    return Promise.resolve(true)
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
}

// ✅ sirf user persist karo
const userPersistConfig = {
  key: 'user',
  storage,
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  product : productSlice
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)