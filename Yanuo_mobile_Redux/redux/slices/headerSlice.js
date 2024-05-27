import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const headerSlicer = createSlice({
    name: 'header',
    initialState: {
        // isFocused: false
    },
    reducers: {
        setInputBoxTranslateX(state, action) {
            state._input_box_translate_x = action.payload;
        },
    }
});

export default headerSlicer.reducer;