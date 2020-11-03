import React from 'react';
import { useDispatch } from 'react-redux';
import '../../styles/SearchResetAddBar.css';
import { fetchSoldiers } from './SoldiersSlice';

const SearchResetAddBar = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <form>
                <input type="text"/>
            </form>
            <button onClick={() => dispatch(fetchSoldiers('default'))}>
                Reset
            </button>
            <button>
                New Soldier
            </button>
        </div>
    )
}

export default SearchResetAddBar;