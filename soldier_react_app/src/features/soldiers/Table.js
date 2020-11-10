import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSoldiers, fetchSoldiers } from './SoldiersSlice'
import InfiniteScroll from 'react-infinite-scroll-component';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const Table = () => {
  const dispatch = useDispatch();
  const soldiers = useSelector(selectAllSoldiers);
  const globalOrder = useSelector((state) => state.soldiers.order);
  const globalSortField = useSelector((state) => state.soldiers.sortField);
  const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
  const hasNextPage = useSelector((state) => state.soldiers.pagination.hasNextPage);
  const [hasMore, setHasMore] = useState(hasNextPage);

  useEffect(() => {
    setHasMore(hasNextPage);
  }, [hasNextPage]);
  const fetchMoreSoldiers = () => {
    setTimeout(() => {
      dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
    }, 1500);
  }
    // Render the UI for your table
  return (
    <InfiniteScroll
      dataLength={soldiers.length}
      next={fetchMoreSoldiers}
      hasMore={hasMore}
      loader={<h4>Loading next page...</h4>}
      scrollableTarget="table-row"
      inverse={true}
    >
      <table>
        <TableHeader/>
        <TableBody/>
      </table>
      <h4>{hasMore ? "" : "You've reached my limit :("}</h4>
    </InfiniteScroll>
  );
}
  
  export default Table;