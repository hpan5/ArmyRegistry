import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEditingUser, fetchSuperiorCandidates, selectAllSoldiers, fetchSoldiers, deleteSoldierById, setNewSuperiorId, setPreviousScrollPosition, reset } from './SoldiersSlice'
import { useHistory } from 'react-router-dom';

const TableBody = (props) => {
    const dispatch = useDispatch();
    const soldiers = useSelector(selectAllSoldiers);
    const globalStatus = useSelector((state) => state.soldiers.status);
    const globalOrder = useSelector((state) => state.soldiers.order);
    const globalSortField = useSelector((state) => state.soldiers.sortField);
    const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
    const globalSkip = useSelector((state) => state.soldiers.pagination.offset);
    const globalLimit = useSelector((state) => state.soldiers.limit);
    const searchTerm = useSelector((state) => state.soldiers.searchTerm);
    //const previousScrollPosition = useSelector((state) => state.soldiers.previousScrollPosition);
    const history = useHistory();
    useEffect(() => {
        if (globalStatus === 'idle' && globalSkip === 0) {
            console.log("fetching soldiers [TABLE BODY RELOADING]: ");
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder, limit: globalLimit, filter: searchTerm}));
        }
    },[dispatch, globalStatus, globalSuperiorId, globalSortField, globalOrder, globalSkip, globalLimit, searchTerm]);
    

    const handleEditSolderClick = (editingSoldier) => {
        dispatch(setPreviousScrollPosition({previousScrollPosition: props.scrollArea.current.scrollTop}));
        dispatch(addEditingUser({ editingSoldier }))
        dispatch(fetchSuperiorCandidates({id: editingSoldier.id})).then(
            () => history.push('/EditSolder')
        )
    }

    const handleDeleteSoldierClick = (id) => {
        dispatch(deleteSoldierById(id)).then(() => {
            console.log("fetching soldiers [DELETE SOLDIER]: ");
            dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder, limit: globalLimit, filter: searchTerm}));
        })
    }

    const handleDSNumClick = (props) => {
        const { id } = props;
        dispatch(reset());
        dispatch(setNewSuperiorId({superior_id: id}));
        dispatch(fetchSoldiers({superior_id: id}));
    }

    const handleSuperiorNameClick = (soldier_id) => {
        dispatch(reset());
        dispatch(fetchSoldiers({soldier_id : soldier_id}));
    }
    
    let content;
    if (globalStatus === 'failed') {
        content = (
            <tr>
                <td> error fetching table </td>
            </tr>
        );
    } else {
        //console.log("content: ", soldiers);
        content = (
            soldiers.map((soldier, i) => {
                return (
                        <tr key={soldier.id} className="table-row">
                            <td className="avatar"> <img src={soldier.imageUrl} width="40" height="40" alt=""/> </td>
                            <td> {soldier.name} </td>
                            <td> {soldier.sex} </td>
                            <td> {soldier.rank} </td>
                            <td> {soldier.startDate} </td>
                            <td> <a href={`tel:${soldier.phone}`}> {soldier.phone}</a></td>
                            <td> <a href={`mailto:${soldier.email}`}> {soldier.email} </a> </td>
                            <td className="under" style={!soldier.superior ? {pointerEvents: "none", opacity: "0.4"} : {}} onClick={() => handleSuperiorNameClick(soldier.superior._id)} > 
                                {soldier.superior && soldier.superior.name} 
                            </td>
                            <td className="under" style={soldier.ds_num === 0 ? {pointerEvents: "none", opacity: "0.4"} : {}} onClick={() => handleDSNumClick({id: soldier.id})}> 
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
        <tbody className="table-body">
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
        /*
        if (globalStatus === 'loading') {
        content = (
            <tr>
                <td> Loading </td>
            </tr>
        );
    } else 
*/