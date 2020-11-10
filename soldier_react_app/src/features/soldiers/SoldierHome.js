import React from 'react';
import SearchResetAddBar from './SearchResetAddBar';
import Table from './Table'
const SoldierHome = () => {
    return (
        <div>
            <h3>US Army Personnel Registery</h3>
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