import React from 'react';
import { useDispatch } from 'react-redux';
import '../../styles/SearchResetAddBar.css';
import { changeSoldierOrder, fetchSoldiers } from './SoldiersSlice';
import { useHistory } from 'react-router-dom';

const SearchResetAddBar = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const resetSoldierOrder = () => {
        dispatch(changeSoldierOrder({order: 'default'}));
        dispatch(fetchSoldiers('default'));
    }

    const handleNewSoldierClick = () => {
        history.push('/AddSolder');
    }

    return (
        <div>
            <form>
                <input type="text"/>
            </form>
            <button onClick={resetSoldierOrder}>
                Reset
            </button>
            <button onClick={handleNewSoldierClick}>
                New Soldier
            </button>
        </div>
    )
}


export default SearchResetAddBar;