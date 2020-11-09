import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";
import { addEditingUser, fetchSuperiorCandidates, selectAllSoldiers, fetchSoldiers, fetchSoldierById, deleteSoldierById, setNewSuperiorId } from './SoldiersSlice'
import InfiniteScroll from 'react-infinite-scroll-component';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const Table = () => {
  const dispatch = useDispatch();
  const soldiers = useSelector(selectAllSoldiers);
  const globalStatus = useSelector((state) => state.soldiers.status);
  const globalOrder = useSelector((state) => state.soldiers.order);
  const globalSortField = useSelector((state) => state.soldiers.sortField);
  const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
  useEffect(() => {
    if (globalStatus === 'idle') {
      dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}));
    }
  },[dispatch, globalStatus, globalSuperiorId, globalSortField, globalOrder]);
  const fetchMoreSoldiers = () => {
    dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
  }
    // Render the UI for your table
    return (
      <InfiniteScroll
        dataLength={soldiers.length}
        next={fetchMoreSoldiers}
        hasMore={true}
        loader={<h4>Loading more 2 itens...</h4>}
      >
        <table>
          <TableHeader/>
          <TableBody/>
        </table>
      </InfiniteScroll>
    );
  }
  