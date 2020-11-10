import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addSoldier, fetchSoldiers } from './SoldiersSlice';
import Form from './SoldierForm';
import ImagePicker from './ImagePicker'

const AddSolder = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [image, setImage] = useState();
    const mySubmit = async (soldier) => {
        console.log("submitting solder: ", soldier);
        console.log("submitting image: ", image);
        let imageUrl = {imageUrl : image ? `/photos/${image.name}` : "/photos/default_avatar.jpg"};
        soldier = {...soldier, ...imageUrl};
        console.log("about to push new soldier", soldier);
        dispatch(addSoldier(soldier)).then(() => {
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
           <h3>New Soldier</h3> 
           <ImagePicker file={image} onChange={(e) => setImage(e.target.files[0])}/>
           <Form onSubmit={mySubmit} onCancel={handleCancel}/>
        </div>
    );
}



export default AddSolder;