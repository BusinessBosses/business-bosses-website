// shopSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop } from '../../common/interfaces/Shop';

interface ShopState {
  // Define the properties you need.
  shopInfo: Shop | null;
}

const initialState: ShopState = {
  shopInfo: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShopInfo(state, action: PayloadAction<Shop | null>) {
      state.shopInfo = action.payload;
    },
    // Other reducers...
  },
});

export const { setShopInfo } = shopSlice.actions;
export default shopSlice.reducer;
