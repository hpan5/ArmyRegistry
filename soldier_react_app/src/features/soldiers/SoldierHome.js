import React from 'react';
import SearchResetAddBar from './SearchResetAddBar';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import '../../styles/Table.css';

const SoldierHome = () => {
    return (
        <div>
            <h5>US Army Personnel Registery</h5>
            <SearchResetAddBar/>
            <table>
                <TableHeader/>
                <TableBody/>
            </table>
        </div>
    )
}

export default SoldierHome;