import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import meApi, {neApi} from '../../api/meApi';

const KEY = 'me';

const intialState = {
    isLoading: false,
    userProfile: {},
    phoneBooks: [],
};

export const fetchProfile = createAsyncThunk(
    `${KEY}/fetchProfile`,
    async () => {
        const data = await meApi.fetchProfile();
        return data;
    }
)

export const meSlice = createSlice({
    name: 'meProfile',
    initialState: intialState,
    reducers: {
        setUserProfile: (state, action) =>
        {
            state.userProfile = action.payload;
        },
    }
});

export const {setUserProfile} = meSlice.actions;
export default meSlice.reducer;