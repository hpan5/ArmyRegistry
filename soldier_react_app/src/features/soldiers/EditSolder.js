import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editSoldier, fetchSoldiers } from './SoldiersSlice';
import ImagePicker from './ImagePicker'
import Form from './SoldierForm';
const EditSolder = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [image, setImage] = useState();
    const handleSubmit = (soldier) => {
        console.log("submitting", soldier);
        console.log("submitting image: ", image);
        let imageUrl = {imageUrl : image ? `/photos/${image.name}` : "/photos/default_avatar.jpg"};
        soldier = {...soldier, ...imageUrl};
        console.log("about to edit soldier", soldier);
        
        dispatch(editSoldier(soldier)).then(() => {
            dispatch(fetchSoldiers({})).then(() => {
                history.goBack();
            })
        })
        
    }
    const handleCancel = () => {
        console.log("cancelling");
        history.goBack();
    }
    return (
        <div>
            <h3>Update Soldier</h3>
            <ImagePicker file={image} onChange={(e) => setImage(e.target.files[0])}/>
            <Form onSubmit={handleSubmit} onCancel={handleCancel}/>
        </div>
    );
}

export default EditSolder;