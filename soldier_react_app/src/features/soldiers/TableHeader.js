import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeSoldierOrder, fetchSoldiers } from './SoldiersSlice';

const TableHeader = () => {
    const dispatch = useDispatch();
    const soldiersOrder = useSelector((state) => state.soldiers.order);

    const sortSoldiersByName = () => {
        
        let changedOrder = 'asc';
        if (soldiersOrder === 'asc') {
            changedOrder = 'dsc';
        }
        console.log("soldier order: " + soldiersOrder + ", order: " + changedOrder);
        dispatch(changeSoldierOrder({order: changedOrder}));
        dispatch(fetchSoldiers(changedOrder));
    }

    
    return (
        <thead>
            <tr>
                <th> Avatar </th>
                <th onClick={sortSoldiersByName}> Name <i class='fas fa-sort'></i></th>
                <th> Sex </th>
                <th> Rank </th>
                <th> Start Date </th>
                <th> Phone </th>
                <th> Email </th>
                <th> Superior </th>
                <th> # of D.S. </th>
                <th> Edit </th>
                <th> Delete </th>
            </tr>
        </thead>
    );
}

export default TableHeader;