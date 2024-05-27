import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import {}

const KEY = 'global';

const initialState = {
    isLoading: false,
    isLogin: false,
    modalVisible: false,
    currentUserId: '',
    keyboardHeight: 280,
    stickers: [],
};

const globalSlice = createSlice({
    name: KEY,
    initialState: initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setLogin: (state, action) => {
            state.isLogin = action.payload;
        },
        setCurrentUserId: (state, action) => {
            state.currentUserId = action.payload;
        }
    }
});

const {reducer, actions} = globalSlice;
export const{
    setLoading,
    setLogin,
    setCurrentUserId
} = actions;
export default reducer;