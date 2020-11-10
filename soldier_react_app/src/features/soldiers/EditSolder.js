import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editSoldier, fetchSoldiers } from './SoldiersSlice';
import ImagePicker from './ImagePicker'
import Form from './SoldierForm';
const EditSolder = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const globalOrder = useSelector((state) => state.soldiers.order);
    const globalSortField = useSelector((state) => state.soldiers.sortField);
    const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
    const globalSkip = useSelector((state) => state.soldiers.pagination.offset);
    const globalLimit = useSelector((state) => state.soldiers.limit);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);
    const [image, setImage] = useState();
    const handleSubmit = (soldier) => {
        console.log("submitting", soldier);
        console.log("submitting image: ", image);
        let imageUrl = {imageUrl : image ? `/photos/${image.name}` : "/photos/default_avatar.jpg"};
        soldier = {...soldier, ...imageUrl};
        console.log("about to edit soldier", soldier);
        
        dispatch(editSoldier(soldier)).then(() => {
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder, limit: globalLimit, filter: searchTerm})).then(() => {
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