import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = "http://localhost:8000/soldiers/";
const initialState = {
    soldiers: [],
    superior_id: undefined,
    sortField: undefined,
    order: 'default',
    status: 'idle',
    error: null
}
//create and add a new soldier
export const addSoldier = createAsyncThunk('soldiers/addSoldier', async (soldier) => {
    const apiUrl =  `${url}addNewSoldier/`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.post(apiUrl, soldier);
    console.log(response.data);
    return soldier;
});

//fetch the soldier based on sortfield, sortOrder and need to skip number
export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (props) => {
    console.log(props);
    const {superior_id = undefined, sortField = undefined, order = "default", skip = 0} = props;
    //console.log("sortField: " + sortField.toString() + ", sortOrder: " + order.toString() + ", skip:" + skip);
    const apiUrl =  `${url}fetchSoldiers?` + 
        (superior_id !== undefined ? `superior_id=${superior_id}` : '') + 
        (sortField !== undefined ? `&sortField=${sortField}` : '') + 
        (order !== undefined ? `&order=${order}` : '') + 
        (skip !== undefined ? `&skip=${skip}` : '');
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    //console.log(response.data);
    return response.data;
});

//delete soldier based on its id
export const deleteSoldierById = createAsyncThunk('soldiers/deleteSoldierById', async (id) => {
    const apiUrl =  `${url}deleteSoldier/${id}`;
    console.log("apiUrl:" + apiUrl);
    await axios.delete(apiUrl);
    return id;
});

export const fetchSoldierById = createAsyncThunk('soldiers/fetchSoldierById', async (id) => {
    const apiUrl =  `${url}fetchSoldier/${id}`;
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return response.data;
});


const soldiersSlice = createSlice({
    name: 'soldiers',
    initialState,
    reducers: {
        changeSoldierOrder(state, action) {
            const { sortField } = action.payload;
            console.log('state.sortField: ' + state.sortField + ', sortField: ' + sortField);
            if (state.sortField === sortField) {
                state.order = state.order === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortField = sortField;
                state.order = 'asc';
            }
            console.log('state.sortField: ' + state.sortField + ', state.order: ' + state.order);
            
        },
        reset(state, action) {
            state.sortField = undefined;
            state.order = '';
            state.superior_id = undefined;
        },
        changeSuperior_id(state, action) {
            const { id } = action.payload;
            state.superior_id = id;
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

export const { changeSoldierOrder, reset } = soldiersSlice.actions;

export default soldiersSlice.reducer;

export const selectAllSoldiers = (state) => state.soldiers.soldiers;

export const selectSoldierById = (state, soldierId) => 
    state.soldiers.soldiers.find((soldier) => soldier.id === soldierId);