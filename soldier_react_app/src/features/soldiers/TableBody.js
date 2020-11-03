import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSoldiers, fetchSoldiers, fetchSoldierById, fetchDirectSubordinates_BySuperiorID } from './SoldiersSlice'

const TableBody = () => {
    const dispatch = useDispatch();
    const soldiers = useSelector(selectAllSoldiers);
    const soldiersStatus = useSelector((state) => state.soldiers.status);

    useEffect(() => {
        if (soldiersStatus === 'idle') {
            dispatch(fetchSoldiers('default'));
        }
    },[soldiersStatus, dispatch, soldiers]);

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
        console.log("about to render list:", soldiers);
        content = (
            soldiers.map((soldier, i) => 
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
        );
    }
    return (
        <tbody>
            {content}
        </tbody>
    );
}


export default TableBody;