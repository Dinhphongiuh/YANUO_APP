import { configureStore } from "@reduxjs/toolkit";
import homeScreenSlice  from "./slices/HomeScreenSlice";
import global from './slices/globalSlice';
import sigupScreenSlice from "./slices/sigupSlice";
import meSlice from "./slices/meSlice";
import friendSlice from './slices/friendSlice';

const rootReducer = {
    global,
    homeScreenSlice,
    sigupScreenSlice,
    meSlice,
    friendSlice,
}

// const store = configureStore({
//     reducer: {
//         global,
//         // headerSlice: headerSlice.reducer,
//         homeScreenSlice: homeScreenSlice.reducer,
//     }
// });

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
})

export default store;