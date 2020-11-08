import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEditingUser, fetchSuperiorCandidates, selectAllSoldiers, fetchSoldiers, fetchSoldierById, deleteSoldierById, setNewSuperiorId } from './SoldiersSlice'
import { useHistory } from 'react-router-dom';

const TableBody = () => {
    const dispatch = useDispatch();
    const soldiers = useSelector(selectAllSoldiers);
    const globalStatus = useSelector((state) => state.soldiers.status);
    const globalOrder = useSelector((state) => state.soldiers.order);
    const globalSortField = useSelector((state) => state.soldiers.sortField);
    const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
    const history = useHistory();
    useEffect(() => {
        if (globalStatus === 'idle') {
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}));
        }
    },[dispatch, globalStatus, globalSuperiorId, globalSortField, globalOrder]);

    const handleEditSolderClick = (editingSoldier) => {
        
        console.log("editing Soldier:" + editingSoldier);
        dispatch(addEditingUser({ editingSoldier }))
        dispatch(fetchSuperiorCandidates({id: editingSoldier.id})).then(
            () => history.push('/EditSolder')
        )
    }

    const handleDeleteSoldierClick = (props) => {
        const { id } = props;
        console.log("id:" + id);
        dispatch(addEditingUser())
        dispatch(deleteSoldierById(id)).then(() => {
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}));
        })
    }
    const handleDSNumClick = (props) => {
        const { id } = props;
        dispatch(setNewSuperiorId({superior_id: id}));
        dispatch(fetchSoldiers({superior_id: id}));
    }
    let content;
    if (globalStatus === 'loading') {
        content = (
            <tr>
                <td> Loading </td>
            </tr>
        );
    } else if (globalStatus === 'failed') {
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
                        <tr key={soldier.id}>
                            <td> Avatar </td>
                            <td> {soldier.name} </td>
                            <td> {soldier.sex} </td>
                            <td> {soldier.rank} </td>
                            <td> {soldier.startDate} </td>
                            <td> {soldier.phone} </td>
                            <td> {soldier.email} </td>
                            <td className="under" onClick={() => dispatch(fetchSoldierById(soldier.superior._id))}> 
                                {soldier.superior && soldier.superior.name} 
                            </td>
                            <td className="under" onClick={() => handleDSNumClick({id: soldier.id})}> 
                                {soldier.ds_num !== 0 && soldier.ds_num} 
                            </td>
                            <td onClick={() => handleEditSolderClick(soldier)}> Edit </td>
                            <td onClick={() => handleDeleteSoldierClick(soldier.id)}> Delete </td>
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