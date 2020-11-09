import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSoldiers, fetchSoldiers, fetchSoldierById, deleteSoldierById, setNewSuperiorId } from './SoldiersSlice'
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
  const hasNextPage = useSelector((state) => state.soldiers.pagination.hasNextPage);
  const [loadMore, setLoadMore] = useState(hasNextPage);
  useEffect(() => {
    if (globalStatus === 'idle') {
      dispatch(fetchSoldiers({superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}));
    }
  },[dispatch, globalStatus, globalSuperiorId, globalSortField, globalOrder]);
  
  useEffect(() => {
    setLoadMore(hasNextPage);
  }, [hasNextPage]);
  const fetchMoreSoldiers = () => {
    dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
  }
    // Render the UI for your table
    return (
      <InfiniteScroll
        dataLength={soldiers.length}
        next={fetchMoreSoldiers}
        hasMore={loadMore}
        loader={<h4>Loading next page...</h4>}
      >
        <table>
          <TableHeader/>
          <TableBody/>
        </table>
      </InfiniteScroll>
    );
  }
  
  export default Table;