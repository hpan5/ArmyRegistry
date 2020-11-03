import { configureStore } from '@reduxjs/toolkit'
import {reducer as formReducer} from 'redux-form';
import soldiersReducer from '../features/soldiers/SoldiersSlice'

export default configureStore({
    reducer: {
        soldiers: soldiersReducer,
        form: formReducer
    }
})