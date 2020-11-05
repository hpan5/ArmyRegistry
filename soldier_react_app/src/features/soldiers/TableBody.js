import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSoldiers, fetchSoldiers, fetchSoldierById, fetchDirectSubordinates_BySuperiorID } from './SoldiersSlice'
import { useHistory } from 'react-router-dom';

const TableBody = () => {
    const dispatch = useDispatch();
    const soldiers = useSelector(selectAllSoldiers);
    const soldiersStatus = useSelector((state) => state.soldiers.status);
    const soldiersOrder = useSelector((state) => state.soldiers.order);
    const history = useHistory();
    useEffect(() => {
        if (soldiersStatus === 'idle') {
            dispatch(fetchSoldiers(soldiersOrder));
        }
    },[dispatch, soldiersStatus, soldiersOrder]);

    const handleEditSolderClick = () => {
        history.push('/EditSolder');
    }

    let content;
    if (soldiersStatus === 'loading') {
        content = (
            <tr>
                <td> Loading </td>
            </tr>
        );
    } else if (soldiersStatus === 'failed') {
        content = (
            <tr>
                <td> error fetching table </td>
            </tr>
        );
    } else {
        //console.log("about to render list:", soldiers);
        content = (
            soldiers.map((soldier, i) => {
                return (
                        <tr className="users" key={soldier.id}>
                            <td> Avatar </td>
                            <td> {soldier.name} </td>
                            <td> {soldier.sex} </td>
                            <td> {soldier.rank} </td>
                            <td> {soldier.startDate} </td>
                            <td> {soldier.phone} </td>
                            <td> {soldier.email} </td>
                            <td className="under" onClick={() => dispatch(fetchSoldierById(soldier.superior))}> 
                                {soldier.superior_name} 
                            </td>
                            <td className="under" onClick={() => dispatch(fetchDirectSubordinates_BySuperiorID(soldier.id))}> 
                                {soldier.ds_num !== 0 && soldier.ds_num} 
                            </td>
                            <td onClick={handleEditSolderClick}> Edit </td>
                            <td> Delete </td>
                        </tr>
                )   
            })
        );
    }
    return (
        <tbody>
            {content}
        </tbody>
    );
}


export default TableBody;

/*
content = (
                <InfiniteScroll
                        dataLength={3}
                        next={() => dispatch(fetchSoldiers(soldiersOrder, soldiers.length))}
                        hasMore={hasMore}
                        loader={hasMore && <h4>Loading...</h4>}
                    >
                    {soldiers.map((soldier, i) => {
                        return (
                                <tr className="users" key={soldier.id}>
                                    <td> Avatar </td>
                                    <td> {soldier.name} </td>
                                    <td> {soldier.sex} </td>
                                    <td> {soldier.rank} </td>
                                    <td> {soldier.startDate} </td>
                                    <td> {soldier.phone} </td>
                                    <td> {soldier.email} </td>
                                    <td className="under" onClick={() => dispatch(fetchSoldierById(soldier.superior))}> 
                                        {soldier.superior_name} 
                                    </td>
                                    <td className="under" onClick={() => dispatch(fetchDirectSubordinates_BySuperiorID(soldier.id))}> 
                                        {soldier.direct_subordinates && soldier.direct_subordinates.length !== 0 && soldier.direct_subordinates.length} 
                                    </td>
                                    <td> Edit </td>
                                    <td> Delete </td>
                                </tr>
                        )   
                    })}
            </InfiniteScroll>  
            
        );
*/