import React, { useRef } from 'react';
import SearchResetAddBar from './SearchResetAddBar';
import Table from './Table'
const SoldierHome = () => {
    const ref = useRef();
    return (
        <div>
            <h3>US Army Personnel Registery</h3>
            <SearchResetAddBar scrollArea={ref}/>
            <Table scrollArea={ref}/>
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