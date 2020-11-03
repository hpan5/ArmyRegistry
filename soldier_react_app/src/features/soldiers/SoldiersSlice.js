import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = "http://localhost:8000/soldiers/";
const initialState = {
    soldiers: [],
    order: 'default',
    status: 'idle',
    error: null
}

export const addSoldier = createAsyncThunk('soldiers/addSoldier', async (soldier) => {
    const apiUrl =  `${url}addNewSoldier/`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.post(apiUrl, soldier);
    console.log(response.data);
    return soldier;
});

export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (order, skip = 0) => {
    skip = 0
    const apiUrl =  `${url}fetchSoldiers/${order}?skip=${skip}`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return response.data;
});

export const deleteSoldierById = createAsyncThunk('soldiers/deleteSoldierById', async (id) => {
    const apiUrl =  `${url}deleteSoldier/${id}`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.delete(apiUrl);
    return id;
});

export const fetchSoldierById = createAsyncThunk('soldiers/fetchSoldierById', async (id) => {
    const apiUrl =  `${url}fetchSoldier/${id}`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return response.data;
});

export const fetchDirectSubordinates_BySuperiorID = createAsyncThunk('soldiers/fetchDirectSubordinates', async (id) => {
    const apiUrl =  `${url}fetchDirectSubordinates/${id}`;
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

        },
        changeSoldierOrder(state, action) {
            const { order } = action.payload;
            state.order = order;
        }
    },
    extraReducers: {
        [fetchSoldiers.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchSoldiers.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.soldiers = [...action.payload]//state.soldiers.concat(action.payload)
        },
        [fetchSoldiers.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload)
        },
        [fetchSoldierById.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            //console.log("action pay load after fetch soldier", action.payload);
            state.soldiers = [action.payload]
        },
        [fetchSoldierById.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload)
        },
        [fetchDirectSubordinates_BySuperiorID.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchDirectSubordinates_BySuperiorID.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.soldiers = action.payload
        },
        [fetchDirectSubordinates_BySuperiorID.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload)
        },
        [addSoldier.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.soldiers = [...state.soldiers, action.payload]
        },
        [addSoldier.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload)
        }
    }
})

export const { soldierEdited, changeSoldierOrder } = soldiersSlice.actions;

export default soldiersSlice.reducer;

export const selectAllSoldiers = (state) => state.soldiers.soldiers;

export const selectSoldierById = (state, soldierId) => 
    state.soldiers.soldiers.find((soldier) => soldier.id === soldierId);