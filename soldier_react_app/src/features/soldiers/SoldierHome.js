import React from 'react';
import SearchResetAddBar from './SearchResetAddBar';
import '../../styles/Table.css';
import Table from './Table'
const SoldierHome = () => {
    return (
        <div>
            <h5>US Army Personnel Registery</h5>
            <SearchResetAddBar/>
            <Table/>
        </div>
    )
}

export default SoldierHome;
/*
<table>
                <TableHeader/>
                <TableBody/>
            </table>
*/