import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state


interface RouteState {
    currentIndex: number,
    route: string
}

// Define the initial state using that type
const initialState: RouteState = {
    currentIndex: 0,
    route: '/'
}

export const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        onChangeRoute: (state, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },

    },
})

export const { onChangeRoute } = routeSlice.actions

export default routeSlice.reducer