import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/SearchResetAddBar.css';
import { reset, fetchSoldiers, fetchSuperiorCandidates, setSearchTerm, selectAllSoldiers } from './SoldiersSlice';
import { useHistory } from 'react-router-dom';

const SearchResetAddBar = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const soldiers = useSelector(selectAllSoldiers);
    const globalOrder = useSelector((state) => state.soldiers.order);
    const globalSortField = useSelector((state) => state.soldiers.sortField);
    const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
    const globalLimit = useSelector((state) => state.soldiers.limit);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);

    const resetSoldierOrder = () => {
        console.log("props.scrollArea" , props.scrollArea);
        props.scrollArea.current.scrollTo(0, 0);
        dispatch(reset());
        dispatch(fetchSoldiers({}));
    }

    const handleNewSoldierClick = async () => {
        dispatch(fetchSuperiorCandidates({})).then(
            () => history.push('/AddSolder')
        )
    }

    const handleChange = (event) => {
        event.preventDefault();
        dispatch(setSearchTerm({searchTerm: event.target.value}));
        console.log("search value: " + event.target.value)
        dispatch(fetchSoldiers({filter: event.target.value, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder, limit: globalLimit}));
    }
    return (
        <div>
            <div>
                <small>soldiers NO. : {soldiers.length}</small>
            </div> 
            <div className="bar">
                <form className="barForm">
                    <label> Search </label>
                    <input type="text" onChange={handleChange} value={searchTerm}/>
                </form>
                <button onClick={resetSoldierOrder} className="bar_button" >
                    Reset
                </button>
                <button onClick={handleNewSoldierClick} className="bar_button">
                    New Soldier
                </button>
            </div>
        </div>
        
    )
}


export default SearchResetAddBar;