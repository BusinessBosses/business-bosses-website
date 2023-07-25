import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Industry } from '../../common/interfaces/industry'

// Define a type for the slice state


interface IndustryState {
    industries: Industry[]

}

// Define the initial state using that type
const initialState: IndustryState = {
    industries: []
}

export const industrySlice = createSlice({
    name: 'industry',
    initialState,
    reducers: {

        saveIndustriesToState: (state, action: PayloadAction<Industry[]>) => {
            state.industries = action.payload
        },

    },
})

export const { saveIndustriesToState } = industrySlice.actions

export default industrySlice.reducer