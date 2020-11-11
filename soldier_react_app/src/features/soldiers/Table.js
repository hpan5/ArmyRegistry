import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllSoldiers, fetchSoldiers } from './SoldiersSlice'
import InfiniteScroll from 'react-infinite-scroller';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import '../../styles/Table.css';
const Table = (props) => {
  const dispatch = useDispatch();
  const soldiers = useSelector(selectAllSoldiers);
  const globalOrder = useSelector((state) => state.soldiers.order);
  const globalSortField = useSelector((state) => state.soldiers.sortField);
  const globalSuperiorId = useSelector((state) => state.soldiers.superior_id);
  const hasNextPage = useSelector((state) => state.soldiers.pagination.hasNextPage);
  const [hasMore, setHasMore] = useState(hasNextPage);
  //const previousScrollPosition = useSelector((state) => state.soldiers.previousScrollPosition);
  //const ref = useRef();
  //const [globalScrollTop, setGlobalScrollTop] = useState(0);
  useEffect(() => {
    setHasMore(hasNextPage);
    //setGlobalScrollTop(previousScrollPosition);
    //console.log("global scroll", globalScrollTop);
  }, [hasNextPage]);

  const fetchMoreSoldiers = () => {
    console.log("fetching new soldiers");
    //dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
    setTimeout(() => {
      dispatch(fetchSoldiers({skip: soldiers.length, superior_id: globalSuperiorId, sortField: globalSortField, order: globalOrder}))
    }, 500);
    
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
    <div>
      <table>
        <TableHeader/>
      </table>
      <div style={{height:`${52 * 5}px`, overflow:"auto"}} ref={props.scrollArea}>
        <InfiniteScroll
          pageStart={1}
          loadMore={fetchMoreSoldiers}
          hasMore={hasMore}
          loader={<h6 key="myH4">Loading next page...</h6>}
          initialLoad={false}
          isReverse={false}
          useWindow={false}
          threshold={50}
        >
          <table>
              <TableBody />
              <tfoot>
              <tr>
                <td>{hasMore ? "" : "You've reached my limit :("}</td>
              </tr>
              </tfoot>
          </table>
        </InfiniteScroll>
      </div>
      
    </div>
    
  );
}
  
  export default Table;