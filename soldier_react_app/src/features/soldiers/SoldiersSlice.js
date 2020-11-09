import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = "http://localhost:8000/soldiers/";
const initialState = {
    soldiers: [],
    superiorCandidates: [],
    superior_id: undefined,
    sortField: undefined,
    searchTerm: undefined,
    editingSoldier: undefined,
    order: '',
    status: 'idle',
    pagination: {
        totalDocs: 0,
        offset: 0,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
    },
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
    //console.log(props);
    const {superior_id = undefined, sortField = undefined, order = "", skip = 0} = props;
    //console.log("sortField: " + sortField.toString() + ", sortOrder: " + order.toString() + ", skip:" + skip);
    const apiUrl =  `${url}fetchSoldiers?` + 
        (superior_id !== undefined ? `superior_id=${superior_id}` : '') + 
        (sortField !== undefined ? `&sortField=${sortField}` : '') + 
        (order !== undefined ? `&order=${order}` : '') + 
        (skip !== undefined ? `&skip=${skip}` : '');
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return {data: response.data, skip: skip};
});

//fetch the soldier based on sortfield, sortOrder and need to skip number
export const fetchSuperiorCandidates = createAsyncThunk('soldiers/fetchSuperiorCandidates', async (props) => {
    console.log(props);
    const {id = undefined} = props;
    //console.log("sortField: " + sortField.toString() + ", sortOrder: " + order.toString() + ", skip:" + skip);
    const apiUrl =  `${url}fetchSuperiorCandidates?` + 
        (id !== undefined ? `id=${id}` : '');
    console.log("fetch superior candidates apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    console.log("superior candidates:", response.data);
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
            state.searchTerm = "";
        },
        setNewSuperiorId(state, action) {
            reset();
            const { superior_id } = action.payload;
            state.superior_id = superior_id;
        },
        addEditingUser(state, action) {
            const { editingSoldier } = action.payload;
            state.editingSoldier = editingSoldier;
        }
    },
    extraReducers: {
        //fetchSoldiers
        [fetchSoldiers.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchSoldiers.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            let data = action.payload.data;
            console.log("data: ", data);
            let newSoldiers = data.docs;
            state.pagination.totalDocs = data.totalDocs;
            state.pagination.offset = data.offset;
            state.pagination.limit = data.limit;
            state.pagination.page = data.page;
            state.pagination.hasPrevPage = data.hasPrevPage;
            state.pagination.hasNextPage = data.hasNextPage;
            state.pagination.prevPage = data.prevPage;
            state.pagination.nextPage = data.nextPage;
            console.log("newSoldiers, ", newSoldiers);
            if (action.payload.skip === 0) {
                state.soldiers = [...newSoldiers];
            } else {
                state.soldiers = state.soldiers.concat(newSoldiers);
            }
            //state.soldiers.concat(action.payload)
        },
        [fetchSoldiers.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload.data)
        },
        //fetchSoldierById
        [fetchSoldierById.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            //console.log("action pay load after fetch soldier", action.payload);
            state.soldiers = [action.payload]
        },
        [fetchSoldierById.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload)
        },
        //fetchSuperiorCandidates
        [fetchSuperiorCandidates.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.superiorCandidates = [...action.payload]//state.soldiers.concat(action.payload)
        },
        [fetchSuperiorCandidates.rejected]: (state, action) => {
            state.status = 'failed'
            state.superiorCandidates.push(action.payload)
        },
        //addSoldier
        [addSoldier.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.soldiers = [...state.soldiers, action.payload]
        },
        [addSoldier.rejected]: (state, action) => {
            state.status = 'failed'
            state.soldiers.push(action.payload)
        },
        //deleteSoldierById
        /*
        [deleteSoldierById.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            console.log("delete id: ", action.payload);
            let listAfterDeleted = state.soldiers.filter((soldier) => soldier.id !== action.payload);
            console.log(listAfterDeleted);
            state.soldiers = listAfterDeleted;
        },*/
        [deleteSoldierById.rejected]: (state, action) => {
            state.status = 'failed'
            //state.soldiers.push(action.payload)
        }
    }
})

export const { changeSoldierOrder, reset, setNewSuperiorId, addEditingUser } = soldiersSlice.actions;

export default soldiersSlice.reducer;

export const selectAllSoldiers = (state) => state.soldiers.soldiers;

export const selectSoldierById = (state, soldierId) => 
    state.soldiers.soldiers.find((soldier) => soldier.id === soldierId);