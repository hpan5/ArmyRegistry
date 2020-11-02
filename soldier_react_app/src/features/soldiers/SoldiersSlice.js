import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import axios from 'axios';
const url = "http://localhost:8000/soldiers/";
const initialState = {
    soldiers: [],
    order: "default",
    status: 'idle',
    error: null
}

export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (order) => {
    const apiUrl =  `${url}fetchSoldiers/${order}`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return response.data;
});

const soldiersSlice = createSlice({
    name: 'soldiers',
    initialState,
    reducers: {
        soldierAdded(state, action) {

        },
        soldierEdited(state, action) {

        }
    },
    extraReducers: {
        [fetchSoldiers.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchSoldiers.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.soldiers = state.soldiers.concat(action.payload)
        }
    }
})

export const { soldierAdded, soldierEdited } = soldiersSlice.actions;

export default soldiersSlice.reducer;

export const selectAllSoldiers = (state) => state.soldiers.soldiers;

export const selectSoldierById = (state, soldierId) => 
    state.soldiers.soldiers.find((soldier) => soldier.id === soldierId);