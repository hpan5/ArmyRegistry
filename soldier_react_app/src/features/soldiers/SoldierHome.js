import React from 'react';
import Search from './SearchSoldier';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import '../../styles/Table.css';

const SoldierHome = () => {
    return (
        <div>
            <h3>US Army Personnel Registery</h3>
            <Search/>
            <table>
                <TableHeader/>
                <TableBody/>
            </table>
        </div>
    )
}

export default SoldierHome;