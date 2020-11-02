import { configureStore } from '@reduxjs/toolkit'

import soldiersReducer from '../features/soldiers/SoldiersSlice'

export default configureStore({
    reducer: {
        soldiers: soldiersReducer
    }
})