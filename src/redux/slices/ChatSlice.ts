import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Chat } from '../../common/interfaces/chat';

// Define a type for the slice state


interface ChatState {
    chats: Chat[]

}

// Define the initial state using that type
const initialState: ChatState = {
    chats: []
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        saveChatsToState: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload
        },

        saveNewChat: (state, action: PayloadAction<Chat>) => {
            state.chats.push(action.payload)
        },

    },
})

export const { saveNewChat, saveChatsToState } = chatSlice.actions

export default chatSlice.reducer