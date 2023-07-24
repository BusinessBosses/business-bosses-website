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

        removeChat: (state, action: PayloadAction<number>) => {
            state.chats.splice(action.payload, 1)
        },


    },
})

export const { saveNewChat, saveChatsToState, removeChat } = chatSlice.actions

export default chatSlice.reducer