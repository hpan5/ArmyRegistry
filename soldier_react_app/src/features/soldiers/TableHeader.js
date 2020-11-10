import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeSoldierOrder, fetchSoldiers } from './SoldiersSlice';

const TableHeader = () => {
    const dispatch = useDispatch();
    const order = useSelector((state) => state.soldiers.order);
    const sortField = useSelector((state) => state.soldiers.sortField);
    const superiorId = useSelector((state) => state.soldiers.superior_id);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);
    const changeSortFieldAndOrder = (field) => {
        dispatch(changeSoldierOrder({sortField : field}));
        console.log('fieldName: ' + sortField + ', order: ' + order);
        
    }
    
    useEffect(() => {
        console.log("fetching data since sortfield or order changes: " + searchTerm);
        dispatch(fetchSoldiers({filter: searchTerm, superior_id: superiorId, sortField : sortField, order: order}));
    },[dispatch, searchTerm, superiorId, sortField, order]);
    
    return (
        <thead>
            <tr>
                <th> Avatar </th>
                <th onClick={() => changeSortFieldAndOrder('name')}> Name </th>
                <th onClick={() => changeSortFieldAndOrder('sex')}> Sex </th>
                <th onClick={() => changeSortFieldAndOrder('rank')}> Rank </th>
                <th onClick={() => changeSortFieldAndOrder('startDate')}> Start Date </th>
                <th onClick={() => changeSortFieldAndOrder('phone')}> Phone </th>
                <th onClick={() => changeSortFieldAndOrder('email')}> Email </th>
                <th onClick={() => changeSortFieldAndOrder('superior')}> Superior </th>
                <th onClick={() => changeSortFieldAndOrder('ds_num')}> # of D.S. </th>
                <th> Edit </th>
                <th> Delete </th>
            </tr>
        </thead>
    );
}

export default TableHeader;
//<i class='fas fa-sort'></i>