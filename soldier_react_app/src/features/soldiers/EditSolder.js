import React from 'react';
//import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
//import { addSoldier, fetchSoldiers } from './SoldiersSlice';
import Form from './Form';
const EditSolder = () => {
    //const dispatch = useDispatch();
    const history = useHistory();
    const handleSubmit = (soldier) => {
        console.log("submitting", soldier);
        /*
        dispatch(addSoldier(soldier)).then(() => {
            dispatch(fetchSoldiers({})).then(() => {
                history.goBack();
            })
        })
        */
    }
    const handleCancel = () => {
        console.log("cancelling");
        history.goBack();
    }
    return (
        <div>
            <h3>Update Soldier</h3>
            <Form onSubmit={handleSubmit} onCancel={handleCancel}/>
        </div>
    );
}

export default EditSolder;