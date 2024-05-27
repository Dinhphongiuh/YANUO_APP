import { createSlice } from "@reduxjs/toolkit";

export const sigupScreenSlice = createSlice({
    name: 'sigupScreen',
    initialState: {
        confirmModal: false,
        userName: '',
        phoneNumber: "",
        gender: '',
        birthDate: "",
        Email: "",
    },
    reducers: {
        setConfirmModal: (state, action) => {
            state.confirmModal = action.payload;
        },
        setSaveUserName: (state, action) => {
            state.userName = action.payload;
        },
        setSaveEmail: (state, action) => {
            state.Email = action.payload;
        },
        setSavePhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        setSaveBirthDate: (state, action) => {
            state.birthDate = action.payload;
        },
        setSaveGender: (state, action) => {
            state.gender = action.payload;
        },
    },
});

export const { setConfirmModal, setSaveUserName, setSavePhoneNumber, setSaveBirthDate, setSaveGender, setSaveEmail } = sigupScreenSlice.actions;

export default sigupScreenSlice.reducer;