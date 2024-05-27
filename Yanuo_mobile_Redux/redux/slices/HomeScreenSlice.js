import { createSlice } from "@reduxjs/toolkit";

export const homeScreenSlice = createSlice({
    name: 'homeScreen',
    initialState: {
        openDropMenu: false,
    },
    reducers: {
        setOpenDropMenu: (state, action) => {
            state.openDropMenu = action.payload;
        },
    },
});

export const { setOpenDropMenu } = homeScreenSlice.actions;

export default homeScreenSlice.reducer;