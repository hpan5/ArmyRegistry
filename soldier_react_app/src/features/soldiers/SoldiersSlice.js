import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = "http://localhost:8000/soldiers/";
const initialState = {
    soldiers: [],
    superiorCandidates: [],
    limit: 5,
    soldier_id : undefined,
    superior_id: undefined,
    sortField: undefined,
    searchTerm: '',
    order: '',
    status: 'idle',
    pagination: {
        totalDocs: 0,
        offset: 0,
        limit: 5,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
    },
    editingSoldier: undefined,
    previousScrollPosition : 0,
    error: null
}
//create and add a new soldier
export const addSoldier = createAsyncThunk('soldiers/addSoldier', async (soldier) => {
    const apiUrl =  `${url}addNewSoldier/`;
    //console.log("apiUrl:" + apiUrl);
    const response = await axios.post(apiUrl, soldier);
    console.log("successfully added", response.data);
    return soldier;
});

//create and edit a soldier
export const editSoldier = createAsyncThunk('soldiers/editSoldier', async (props) => {
    const { id, soldier } = props;
    const apiUrl =  `${url}editSoldier/${id}`;
    //console.log("editing soldiers!!!! apiUrl:" + apiUrl);
    const response = await axios.put(apiUrl, soldier);
    console.log("successfully edited", response.data);
    return soldier;
});

//fetch the soldier based on sortfield, sortOrder and need to skip number
export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (props) => {
    //console.log(props);
    const {soldier_id=undefined, superior_id = undefined, sortField = undefined, order = "", skip = 0, filter='', limit=5} = props;
    //console.log("sortField: " + sortField.toString() + ", sortOrder: " + order.toString() + ", skip:" + skip);
    const apiUrl =  `${url}fetchSoldiers?` + 
        (soldier_id !== undefined ? `soldier_id=${soldier_id}` : '') + 
        (superior_id !== undefined ? `superior_id=${superior_id}` : '') + 
        (sortField !== undefined ? `&sortField=${sortField}` : '') + 
        (order !== undefined ? `&order=${order}` : '') + 
        (skip !== undefined ? `&skip=${skip}` : '') + 
        (filter !== undefined ? `&filter=${filter}` : '')+ 
        (limit !== undefined ? `&limit=${limit}` : '');
    console.log("apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    //console.log(response.data);
    return {data: response.data, skip: skip};
});

//fetch the soldier based on sortfield, sortOrder and need to skip number
export const fetchSuperiorCandidates = createAsyncThunk('soldiers/fetchSuperiorCandidates', async (props) => {
    //console.log(props);
    const {id = undefined} = props;
    //console.log("sortField: " + sortField.toString() + ", sortOrder: " + order.toString() + ", skip:" + skip);
    const apiUrl =  `${url}fetchSuperiorCandidates?` + 
        (id !== undefined ? `id=${id}` : '');
    //console.log("fetch superior candidates apiUrl:" + apiUrl);
    const response = await axios.get(apiUrl);
    //console.log("superior candidates:", response.data);
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
    //console.log(response.data);
    return response.data;
});

const soldiersSlice = createSlice({
    name: 'soldiers',
    initialState,
    reducers: {
        changeSoldierOrder(state, action) {
            const { sortField } = action.payload;
            //console.log('state.sortField: ' + state.sortField + ', sortField: ' + sortField);
            if (state.sortField === sortField) {
                state.order = state.order === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortField = sortField;
                state.order = 'asc';
            }
            //fetchSoldiers({filter: state.searchTerm, superior_id: state.superior_id, sortField : state.sortField, order: state.order, limit: state.limit})
            //console.log('state.sortField: ' + state.sortField + ', state.order: ' + state.order);
            
        },
        reset(state, action) {
            state.sortField = undefined;
            state.order = '';
            state.superior_id = undefined;
            state.searchTerm = "";
            state.limit = 5;
            state.previousScrollPosition = 0;
        },
        setNewSuperiorId(state, action) {
            reset();
            const { superior_id } = action.payload;
            state.superior_id = superior_id;
        },
        addEditingUser(state, action) {
            const { editingSoldier } = action.payload;
            state.editingSoldier = {
                id : editingSoldier.id,
                name : editingSoldier.name,
                rank : editingSoldier.rank,
                sex : editingSoldier.sex,
                startDate : editingSoldier.startDate,
                phone : editingSoldier.phone,
                email : editingSoldier.email,
                superior : editingSoldier.superior && editingSoldier.superior._id,
                imageUrl : editingSoldier.imageUrl
            };
            //state.editingSoldier.superior = editingSoldier.superior && editingSoldier.superior._id;
        },
        setSearchTerm(state, action) {
            const { searchTerm } = action.payload;
            state.searchTerm = searchTerm;
        },
        setPreviousScrollPosition(state, action) {
            const { previousScrollPosition } = action.payload;
            state.previousScrollPosition = previousScrollPosition;
        },
        resetEditingSoldier(state, action) {
            state.editingSoldier = undefined;
        }
    },
    extraReducers: {
        //fetchSoldiers
        [fetchSoldiers.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchSoldiers.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            console.log("fetch soldiers fulfilled");
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
            //console.log("newSoldiers, ", newSoldiers);
            if (action.payload.skip === 0) {
                state.soldiers = [...newSoldiers];
            } else {
                state.soldiers = state.soldiers.concat(newSoldiers);
            }
            if (state.searchTerm === '') {
                state.limit = state.soldiers.length <= 5 ? state.limit : state.soldiers.length;
            }
        },
        [fetchSoldiers.rejected]: (state, action) => {
            state.status = 'failed'
            console.log("fetch soldiers rejected");
            state.soldiers.push(action.payload)
        },
        //fetchSoldierById
        [fetchSoldierById.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            console.log("fetch soldiers succeeded");
            //console.log("action pay load after fetch soldier", action.payload);
            action.payload.skip = 0;
            state.pagination.hasNextPage = false;
            state.soldiers = [action.payload]
        },
        [fetchSoldierById.rejected]: (state, action) => {
            state.status = 'failed'
            console.log("fetchSoldierById rejected");
            state.soldiers.push(action.payload)
        },
        //fetchSuperiorCandidates
        [fetchSuperiorCandidates.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            console.log("fetchSoldierById succeeded");
            state.superiorCandidates = [...action.payload]//state.soldiers.concat(action.payload)
        },
        [fetchSuperiorCandidates.rejected]: (state, action) => {
            state.status = 'failed'
            console.log("fetchSuperiorCandidates rejected");
            state.superiorCandidates.push(action.payload)
        },
        //addSoldier
        [addSoldier.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            console.log("addSoldier fulfilled");
            state.soldiers = [...state.soldiers, action.payload]
            state.limit += 1
        },
        [addSoldier.rejected]: (state, action) => {
            state.status = 'failed'
            console.log("addSoldier failed");
            state.soldiers.push(action.payload)
        },
        //editSoldier
        [editSoldier.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            console.log("editSoldier fulfilled");
            //state.editingSoldier = undefined
        },
        [editSoldier.rejected]: (state, action) => {
            state.status = 'failed'
            console.log("editSoldier failed");
            //state.editingSoldier = undefined
        },
        //deleteSoldierById
        
        [deleteSoldierById.fulfilled]: (state, action) => {
            console.log("deleteSoldierById fulfilled");
            state.status = 'succeeded';
        },
        [deleteSoldierById.rejected]: (state, action) => {
            state.status = 'failed'
            console.log("deleteSoldierById failed");
            //state.soldiers.push(action.payload)
        }
    }
})

export const { changeSoldierOrder, reset, setNewSuperiorId, addEditingUser, setSearchTerm, setPreviousScrollPosition, resetEditingSoldier } = soldiersSlice.actions;

export default soldiersSlice.reducer;

export const selectAllSoldiers = (state) => state.soldiers.soldiers;

export const selectSoldierById = (state, soldierId) => 
    state.soldiers.soldiers.find((soldier) => soldier.id === soldierId);