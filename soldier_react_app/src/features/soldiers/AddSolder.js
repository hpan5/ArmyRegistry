import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addSoldier, fetchSoldiers } from './SoldiersSlice';
import Form from './SoldierForm';
import axios from 'axios';
//gAdhZY-_TUWPjVUIkY7ju9ZIPss
const url = '/';
const preset = 'msatr3hj';

const AddSolder = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [image, setImage] = useState([]);
    const handleSubmit = async (soldier) => {
        console.log("submitting solder: ", soldier);
        console.log("submitting image: ", image);
        //console.log("submitting", soldier);
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', preset);
        let imageUrl;
        try {
            console.log("loading to cloud");
            const res = await axios.post(url, formData);
            imageUrl = res.data.secure_url;
            console.log("final imageUrl: ", imageUrl);
        } catch (err) {
            console.error(err);
        }
        soldier.push({'imageUrl' : imageUrl});
        console.log("about to push new soldier", soldier);
        /*dispatch(addSoldier(soldier)).then(() => {
            dispatch(fetchSoldiers({})).then(() => {
                history.goBack();
            })
        })*/
    }
    const handleCancel = () => {
        console.log("cancelling");
        history.goBack();
    }
    return (
        <div>
           <h3>New Soldier</h3> 
           <Form onSubmit={handleSubmit} onCancel={handleCancel} setImage={setImage}/>
        </div>
    );
}



export default AddSolder;