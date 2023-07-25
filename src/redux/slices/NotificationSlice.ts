import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NotificationProp } from '../../common/interfaces/notification';
import { Quote } from '../../common/interfaces/quote';

// Define a type for the slice state


interface NotificationState {
    page: number,
    count: number,
    notifications: NotificationProp[],
    loading: boolean,
    quote: Quote
}

// Define the initial state using that type
const initialState: NotificationState = {
    page: 0,
    count: 0,
    notifications: [],
    loading: false,
    quote: { by: "Brain Tracy", id: 1, message: "Always give without remembering and always receive without forgetting." }
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        incrementPage: (state) => {
            state.page += 1
        },
        saveCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },

        saveQuote: (state, action: PayloadAction<Quote>) => {
            state.quote = action.payload
        },

        changeLoadingState: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        addNotificationsToState: (state, action: PayloadAction<NotificationProp[]>) => {
            state.notifications = [...state.notifications, ...action.payload]
        },
    },
})

export const { incrementPage, addNotificationsToState, saveCount, changeLoadingState, saveQuote } = notificationSlice.actions

export default notificationSlice.reducer