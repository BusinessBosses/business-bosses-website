import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../common/interfaces/user';

// Define a type for the slice state


interface UserState {
    profile: User | null,
    bossup: User | null
}

// Define the initial state using that type
const initialState: UserState = {
    profile: null,
    bossup: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {


        saveUserData: (state, action: PayloadAction<User>) => {
            state.profile = action.payload
        },

        saveBossupData: (state, action: PayloadAction<User>) => {
            state.bossup = action.payload
        },
    },
})

export const { saveUserData, saveBossupData } = userSlice.actions

export default userSlice.reducer