import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../common/interfaces/user';
import { Post } from '../../common/interfaces/post';

// Define a type for the slice state


interface UserState {
    profile: User | null,
    bossup: User | null,
    posts: Post[]
    relevantUsers: User[]
}

// Define the initial state using that type
const initialState: UserState = {
    profile: null,
    bossup: null,
    posts: [],
    relevantUsers: []

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {


        saveUserData: (state, action: PayloadAction<User>) => {
            state.profile = action.payload
        },

        storeRelevantUsers: (state, action: PayloadAction<User[]>) => {
            state.relevantUsers = action.payload
        },

        savePostsToState: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload
        },

        saveBossupData: (state, action: PayloadAction<User>) => {
            state.bossup = action.payload
        },
    },
})

export const { saveUserData, saveBossupData, savePostsToState, storeRelevantUsers } = userSlice.actions

export default userSlice.reducer