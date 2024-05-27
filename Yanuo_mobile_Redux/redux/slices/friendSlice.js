import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import friendApi from '../../api/friendApi';

const KEY = 'friend';

const initialState = {
    isLoading: false,
    listFriends: [],
    searchFriend: {},
    friendRequests: [],
    friendSuggests: [],
};

export const fetchFriends = createAsyncThunk(
    `${KEY}/fetchFriends`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchFriends(params);
        return data;
    },
);

const friendSlice = createSlice({
    name: KEY,
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setSearchFriend: (state, action) => {
            state.searchFriend = action.payload;
        },
        updateFriendStatus: (state, action) => {
            const oldSearchFriend = state.searchFriend;
            const status = action.payload;
            const newSearchFriend = {...oldSearchFriend, status};
            state.searchFriend = newSearchFriend;
        },
        addNewFriendRequest: (state, action) => {
            // const myOldFriendRequests = state.myFriendRequests;
            // const newFriendRequest = state.searchFriend;
            // const myNewFriendRequests = [...myOldFriendRequests, newFriendRequest];
            // state.myFriendRequests  = myNewFriendRequests;
            state.friendRequests = action.payload;
        },
        inviteFriendRequest: (state, action) => {
            const details = action.payload;
            const oldFriendRequests = state.friendRequests;
            state.friendRequests = [...oldFriendRequests, details];
            state.searchFriend.status = friendType.FOLLOWER;
        },
        cancelMyFriendRequest: (state, action) => {
            const {userId, type} = action.payload;
            const myOldFriendRequests = state.myFriendRequests;
            // delete request from list
            const myNewFriendRequests = myOldFriendRequests.filter(
              requestEle => requestEle._id !== userId,
            );
            state.myFriendRequests = myNewFriendRequests;
            state.searchFriend.status = type
              ? friendType.FRIEND
              : friendType.NOT_FRIEND;
        },
        deleteFriendRequest: (state, action) => {
            const userId = action.payload;
            const oldFriendRequests = state.friendRequests;
            // delete request from list
            const newFriendRequests = oldFriendRequests.filter(
              requestEle => requestEle._id !== userId,
            );
            state.friendRequests = newFriendRequests;
            state.searchFriend.status = friendType.NOT_FRIEND;
        },
        resetFriendSlice: (state, action) => {
            Object.assign(state, initialState);
        },
        deleteFriend: (state, action) => {
            const userId = action.payload;
            const oldFriends = state.listFriends;
            // delete from list
            const newFriends = oldFriends.filter(
              requestEle => requestEle._id !== userId,
            );
            state.listFriends = newFriends;
            state.searchFriend.status = friendType.NOT_FRIEND;
        },
    }
});

const {reducer, actions} = friendSlice;
export const {
  setLoading,
  setSearchFriend,
  updateFriendStatus,
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  inviteFriendRequest,
  resetFriendSlice,
  deleteFriend,
} = actions;
export default reducer;