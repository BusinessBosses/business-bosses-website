import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import postSlice from '../slices/PostSlice';
const store = configureStore({
    reducer: {
        post: postSlice
    },
    devTools: process.env.NODE_ENV !== 'production',
})
// export type AppDispatch = typeof store.dispatch
// export const useAppDispatch: () => AppDispatch = useDispatch
// export type RootState = ReturnType<typeof store.getState>

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store