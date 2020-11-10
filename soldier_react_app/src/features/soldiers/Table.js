import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSoldiers, fetchSoldiers, setPreviousScrollPosition } from './SoldiersSlice'
import InfiniteScroll from 'react-infinite-scroller';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import '../../styles/Table.css';
const Table = () => {
  const dispatch = useDispatch();
  const soldiers = useSelector(selectAllSoldiers);
  const globalOrder = useSelector((state) => state.soldiers.order);
  const globalSortField = useSelector((state) => state.soldiers.sortField);
  const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
  const hasNextPage = useSelector((state) => state.soldiers.pagination.hasNextPage);
  const [hasMore, setHasMore] = useState(hasNextPage);
  const previousScrollPosition = useSelector((state) => state.soldiers.previousScrollPosition);
  const ref = useRef();
  const [scrollTop, setScrollTop] = useState(0);
  const [globalScrollTop, setGlobalScrollTop] = useState(0);
  useEffect(() => {
    setHasMore(hasNextPage);
    //setGlobalScrollTop(previousScrollPosition);
    //console.log("global scroll", globalScrollTop);
  }, [hasNextPage, previousScrollPosition]);

  const fetchMoreSoldiers = () => {
    console.log("fetching new soldiers");
    //dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
    const timer = setTimeout(() => {
      dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
    }, 1000);
    
  }
  /*
  
      height={`${53 * soldiers.length}px`}
      onScroll={handleScroll}
      ref={ref}
      initialScrollY="0px"

  const handleScroll = () => {
    setScrollTop(ref.current.lastScrollTop);
    console.log("current scrollTop: ", ref);
  }
  */
  //console.log("previousScrollPosition: " + previousScrollPosition);
    // Render the UI for your table
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={fetchMoreSoldiers}
      hasMore={hasMore}
      loader={<h4>Loading next page...</h4>}
      useWindow={true}
      initialLoad={false}
      isReverse={false}
    >
      <table>
        <TableHeader/>
        <TableBody scrollTop={scrollTop} setGlobalScrollTop={setGlobalScrollTop}/>
      </table>
      <p>{hasMore ? "" : "You've reached my limit :("}</p>
    </InfiniteScroll>
  );
}
  
  export default Table;