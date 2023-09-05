import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Market } from '../../common/interfaces/Market';
import { User } from '../../common/interfaces/user';

// Define a type for the slice state


interface MarketState {
    page: number,
    count: number,
    markets: Market[],
    marketMembers: User[]
    loading: boolean
}

// Define the initial state using that type
const initialState: MarketState = {
    page: 0,
    count: 0,
    markets: [],
    marketMembers: [],
    loading: false
}

export const marketSlice = createSlice({
    name: 'market',
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
        addMarketsToState: (state, action: PayloadAction<Market[]>) => {
            state.markets = [...state.markets, ...action.payload]
        },
        addMembersToState: (state, action: PayloadAction<User[]>) => {
            state.marketMembers = action.payload;
        },
        addNewListing: (state, action: PayloadAction<Market>) => {
            state.markets.unshift(action.payload)
        },

        updateListing: (state, action: PayloadAction<{ index: number, post: Market }>) => {
            state.markets[action.payload.index] = action.payload.post
        }
    },
})

export const { incrementPage, addMarketsToState, saveCount, changeLoadingState, addNewListing, updateListing, addMembersToState } = marketSlice.actions

export default marketSlice.reducer