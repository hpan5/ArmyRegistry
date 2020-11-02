import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { selectAllSoldiers, fetchSoldiers } from './SoldiersSlice'

const TableBody = (props) => {
    const dispatch = useDispatch();
    const soldiers = useSelector(selectAllSoldiers);
    const soldiersStatus = useSelector((state) => state.soldiers.status);
    const error = useSelector((state) => state.soldiers.error);

    useEffect(() => {
        if (soldiersStatus === 'idle') {
            dispatch(fetchSoldiers());
        }
    },[soldiersStatus, dispatch]);
    return (
        <tbody>
            {soldiers.map((soldier, i) => 
                <tr className="users" key={soldier.id}>
                    <td> Avatar </td>
                    <td> {soldier.name} </td>
                    <td> {soldier.sex} </td>
                    <td> {soldier.rank} </td>
                    <td> {soldier.startDate} </td>
                    <td> {soldier.phone} </td>
                    <td> {soldier.email} </td>
                    <td> {soldier.superior} </td>
                    <td> {soldier.direct_subordinates.length} </td>
                    <td> Edit </td>
                    <td> Delete </td>
                </tr>
            )}
        </tbody>
    );
}

export default TableBody;