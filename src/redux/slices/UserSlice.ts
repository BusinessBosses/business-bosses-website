import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../common/interfaces/user';

// Define a type for the slice state


interface UserState {
    profile: User | null
}

// Define the initial state using that type
const initialState: UserState = {
    profile: null
}

export const userSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {


        saveUserData: (state, action: PayloadAction<User>) => {
            state.profile = action.payload
        },
    },
})

export const { saveUserData } = userSlice.actions

export default userSlice.reducer