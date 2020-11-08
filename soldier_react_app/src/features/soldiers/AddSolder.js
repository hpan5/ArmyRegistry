import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addSoldier, fetchSoldiers } from './SoldiersSlice';

import Form from './Form';
const AddSolder = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const handleSubmit = (soldier) => {
        /*dispatch(addSoldier(soldier)).
            then(() => {
                history.goBack();
            })*/

            console.log("submitting")
    }

    const handleCancel = () => {
        console.log("cancelling");
        history.goBack();
    }
    return (
        <div>
           <h3>New Soldier</h3> 
           <Form onSubmit={handleSubmit} onCancel={handleCancel}/>
        </div>
    );
}

export default AddSolder;