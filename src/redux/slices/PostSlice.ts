import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Post } from '../../common/interfaces/post';
import { Forum } from '../../common/interfaces/forum';

// Define a type for the slice state

export interface MixedPostState {

    isForum: boolean;
    data: Post | Forum

}
interface PostState {
    page: number,
    mixedPosts: MixedPostState[],
    loading: boolean
}

// Define the initial state using that type
const initialState: PostState = {
    page: 0,
    mixedPosts: [],
    loading: false
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        incrementPage: (state) => {
            state.page += 1
        },
        changeLoadingState: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        addPostToState: (state, action: PayloadAction<MixedPostState[]>) => {
            state.mixedPosts = [...state.mixedPosts, ...action.payload]
        },
    },
})

export const { incrementPage, addPostToState } = postSlice.actions

export default postSlice.reducer