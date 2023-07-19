import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Forum } from '../../common/interfaces/forum';

// Define a type for the slice state


interface ForumState {
    page: number,
    count: number,
    forums: Forum[],
    loading: boolean
}

// Define the initial state using that type
const initialState: ForumState = {
    page: 0,
    count: 0,
    forums: [],
    loading: false
}

export const forumSlice = createSlice({
    name: 'forum',
    initialState,
    reducers: {
        incrementPage: (state) => {
            state.page += 1
        },
        saveCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        changeLoadingState: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        addForumsToState: (state, action: PayloadAction<Forum[]>) => {
            state.forums = [...state.forums, ...action.payload]
        },
    },
})

export const { incrementPage, addForumsToState, saveCount } = forumSlice.actions

export default forumSlice.reducer