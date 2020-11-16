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
    const superiorCandidates = useSelector((state) => state.soldiers.superiorCandidates);
    const [image, setImage] = useState();
    
    const mySubmit = async (soldier) => {
        let imageUrl = {imageUrl : image ? `/photos/${image.name}` : "/photos/default_avatar.jpg"};
        //let pickedSuperior = superiorCandidates.find(superior => superior.id === soldier.superior);
        let rank = {rank: soldier.rank.value};
        let superior = {superior: soldier.superior && soldier.superior.value};
        let superior_name = {superior_name: soldier.superior && soldier.superior.label};
        //let superior_nameObj = {superior_name: pickedSuperior ? pickedSuperior.name : ""};
        soldier = {...soldier, ...imageUrl, ...superior_name, ...superior, ...rank};
        console.log("soldier ready to be added: ", soldier);
        dispatch(addSoldier(soldier)).then(() => {
            console.log("fetching soldiers [ADD SOLDIER] : ");
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder, limit: globalLimit, filter: searchTerm})).then(() => {
                history.goBack();
            })
        })
    }

    
    const createSoldiers = (num) => {
        let autosoldiers = [];
        let nameArr = shuffleNameArray();
        for (let i = 0; i < num; i++) {
            let soldier = {
                name : nameArr[i],
                rank : rankOptions[generateRandom(rankOptions.length)],
                sex : sex[generateRandom(2)],
                startDate : `${generateRandom(12, 1)}-${generateRandom(29, 1)}-${generateRandom(30) + 1980}`,
                phone : `${generateRandom(999 - 100, 100)}-${generateRandom(999 - 100, 100)}-${(generateRandom(9999 - 1000, 1000))}`,
                email : `${nameArr[i].substring(0, 3)}@gmail.com`,
                imageUrl: "/photos/default_avatar.jpg"
            }
            autosoldiers.push(soldier);
        }
        return autosoldiers;
    }

    const generateRandom = (num, lowBound = 0) => {
        return lowBound + Math.floor(Math.random() * (num));
    }

    const rankOptions = ["General", "Colonel", "Major", "Captain", "Lieutenant", "Warrant Officer",
"Sergeant", "Corporal", "Specialist", "Private"];
    const sex = ["F", "M"];
    function shuffleNameArray() { 
        let array = ["Katie Su", "Kevin Su", "Cindy Su", "John White", "Tony Li", "Cole Faust", "Sara Faust", "Logan Faust", "Shawn Piper", "Michael Brown", 
    "George Brown", "Donald Trump", "Kelly Yang", "LeZi", "Fanny Windson", "Jasmine Su", "Jay Chow", "Vicky Liu", "Andy Wang", "Taylor Swift",
    "Sandy Guo", "Bobby Brown", "William Hua", "Brendan Bene", "Jenny Fineman", "Joe Hofmann", "Ryan Hunter",
    "Rhea McLaughlin", "Shiloh West", "Brycen Boyle", "Mckinley Rush", "Meadow Houston", "Marianna Duke", "Cayden Curtis", "Yesenia Gray", "Stephany Cooke",
    "Karter Patterson", "Karter Patterson", "Kristina Frazier", "Korbin Frye", "Jonas Jarvis",
    "Lilah Rush","Ryland Foster","Carleigh Hendrix","Lyric Stout","Ivy Santos","Averie Hunter","Deven Richmond",
    "Marcelo Hubbard","Uriel Pineda","Destiny Chung","Harper Ali","Bailee Banks","Christian Goodman","Leandro Hooper","Jack Richard",
    "Davian Ballard","Abril Campbell","Cash Frey","Antoine Fleming","Efrain Watkins","Sarai Harrell","Ximena Webb","Izabelle Fox",
    "Matteo Castaneda","Jenny Ibarra","Todd Ortega","Memphis Kennedy","Luciana Arnold","Madalynn Dominguez","Emerson Lloyd",
    "Emanuel Snyder","Xander Walter"
];

        for (var i = array.length - 1; i > 0; i--) {  
            // Generate random number  
            var j = Math.floor(Math.random() * (i + 1)); 
                        
            var temp = array[i]; 
            array[i] = array[j]; 
            array[j] = temp; 
        } 
        return array; 
    } 

    const handleCancel = async () => {
        /*console.log("cancelling");
        let autosoldiers = createSoldiers(10);
        console.log("auto soldiers :  ", autosoldiers);
        console.log("testing auto added soldiers");
        for (let i = 0; i < 10; i++) {
            await dispatch(addSoldier(autosoldiers[i]));
        }*/
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