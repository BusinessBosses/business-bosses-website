import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import postSlice from '../slices/PostSlice';
import UserSlice from '../slices/UserSlice';
import ChatSlice from '../slices/ChatSlice';
import forumSlice from '../slices/ForumSlice';
import IndustrySlice from '../slices/IndustrySlice';
import marketSlice from '../slices/MarketSlice';
import notificationSlice from '../slices/NotificationSlice';
import routeSlice from '../slices/RouteSlice';
const store = configureStore({
    reducer: {
        post: postSlice,
        user: UserSlice,
        chat: ChatSlice,
        forum: forumSlice,
        industry: IndustrySlice,
        market: marketSlice,
        notification: notificationSlice,
        route: routeSlice
    },
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store