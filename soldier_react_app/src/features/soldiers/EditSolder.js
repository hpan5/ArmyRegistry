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
    const globalLimit = useSelector((state) => state.soldiers.limit);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);
    const superiorCandidates = useSelector((state) => state.soldiers.superiorCandidates);
    const editingSoldier = useSelector((state) => state.soldiers.editingSoldier);
    const [image, setImage] = useState();
    const handleSubmit = (soldier) => {
        let imageUrl = {imageUrl : image ? `/photos/${image.name}` : "/photos/default_avatar.jpg"};
        let pickedSuperior = superiorCandidates.find(superior => superior.id === soldier.superior);
        let superior_nameObj = {superior_name: pickedSuperior ? pickedSuperior.name : ""};
        soldier = {...soldier, ...imageUrl, ...superior_nameObj};
        console.log("about to edit soldier", soldier);
        //console.log("editing soldier id: " + editingSoldier);
        dispatch(editSoldier({id: editingSoldier.id, soldier: soldier})).then(() => {
            console.log("fetching soldiers [EDIT SOLDIER]: ");
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