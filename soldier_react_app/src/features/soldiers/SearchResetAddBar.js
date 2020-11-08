import React from 'react';
import { useDispatch } from 'react-redux';
import '../../styles/SearchResetAddBar.css';
import { reset, fetchSoldiers, fetchSuperiorCandidates } from './SoldiersSlice';
import { useHistory } from 'react-router-dom';

const SearchResetAddBar = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const resetSoldierOrder = () => {
        dispatch(reset());
        dispatch(fetchSoldiers({}));
    }

    const handleNewSoldierClick = async () => {
        dispatch(fetchSuperiorCandidates({})).then(
            () => history.push('/AddSolder')
        )
    }

    return (
        <div className="bar">
            <form className="barForm">
                <input type="text"/>
            </form>
            <button onClick={resetSoldierOrder} className="bar_button">
                Reset
            </button>
            <button onClick={handleNewSoldierClick} className="bar_button">
                New Soldier
            </button>
        </div>
    )
}


export default SearchResetAddBar;