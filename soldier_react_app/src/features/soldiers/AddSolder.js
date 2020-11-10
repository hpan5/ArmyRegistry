import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addSoldier, fetchSoldiers } from './SoldiersSlice';
import Form from './SoldierForm';
import ImagePicker from './ImagePicker'

const AddSolder = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const globalOrder = useSelector((state) => state.soldiers.order);
    const globalSortField = useSelector((state) => state.soldiers.sortField);
    const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
    const globalLimit = useSelector((state) => state.soldiers.limit);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);
    const [image, setImage] = useState();
    
    const mySubmit = async (soldier) => {
        //console.log("submitting solder: ", soldier);
        //console.log("submitting image: ", image);
        let imageUrl = {imageUrl : image ? `/photos/${image.name}` : "/photos/default_avatar.jpg"};
        soldier = {...soldier, ...imageUrl};
        //console.log("about to push new soldier", soldier);
        dispatch(addSoldier(soldier)).then(() => {
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder, limit: globalLimit, filter: searchTerm})).then(() => {
                history.goBack();
            })
        })
    }
    const handleCancel = () => {
        //console.log("cancelling");
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