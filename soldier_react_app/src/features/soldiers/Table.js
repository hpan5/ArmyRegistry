import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
function Table({ columns, data, update }) {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state: { sortBy }
    } = useTable(
      {
        columns,
        data
      },
      useSortBy
    );
  
    React.useEffect(() => {
      console.log("sort");
    }, [sortBy]);
  
    // Render the UI for your table
    return (
      <InfiniteScroll
        dataLength={rows.length}
        next={update}
        hasMore={true}
        loader={<h4>Loading more 2 itens...</h4>}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
  
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
    );
  }
  