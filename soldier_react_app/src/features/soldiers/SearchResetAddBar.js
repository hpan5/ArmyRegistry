import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/SearchResetAddBar.css';
import { reset, fetchSoldiers, fetchSuperiorCandidates, setSearchTerm } from './SoldiersSlice';
import { useHistory } from 'react-router-dom';

const SearchResetAddBar = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const globalOrder = useSelector((state) => state.soldiers.order);
    const globalSortField = useSelector((state) => state.soldiers.sortField);
    const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);
    const resetSoldierOrder = () => {
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
        dispatch(setSearchTerm(event.target.value));
        console.log("search value: " + event.target.value)
        dispatch(fetchSoldiers({filter: event.target.value, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}));
    }
    return (
        <div className="bar">
            <form className="barForm">
                <input type="text" onChange={handleChange}/>
            </form>
            <button onClick={resetSoldierOrder} className="bar_button" value={searchTerm}>
                Reset
            </button>
            <button onClick={handleNewSoldierClick} className="bar_button">
                New Soldier
            </button>
        </div>
    )
}


export default SearchResetAddBar;