import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { DataContext } from "context/DataContext";

export default function CardTable({ color, content }) {

  // const { socketIoBinUpdate } = useContext(DataContext);
  const [tableRows, setTableRows] = useState([]);

  const colHeaders = content.headers.map((col) =>
    <th key={col}
      className={
        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
        (color === "light"
          ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
          : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
      }
    >
      {col}
    </th>
  );

  let userRows = []; let binRows = [];
  if (content.type === 'users') {
      userRows = content.list.map((user) =>
        <tr key={ user._id }>
          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
            <span
              className={
                "ml-3 font-bold " +
                +(color === "light" ? "text-blueGray-600" : "text-white")
              }
            >
              {user.name}
            </span>
          </th>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            { user.role }
          </td>
          {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            N/A
          </td> */}
          {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
            <TableDropdown />
          </td> */}
        </tr>
    );
  } else {
    binRows = content.list.map((bin) => {
      console.log(content)
      const { _id, width, length, maxHeight, currentHeight, lastEmptied, location, assignedTo } = bin;
      const maxVolume = length * width * maxHeight;
      const currentVolume = length * width * currentHeight;
      const percentage = Math.ceil((currentHeight/maxHeight)*100);
      return (
        <tr key={ _id }>
          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
            <span
              className={
                "ml-3 font-bold " +
                +(color === "light" ? "text-blueGray-600" : "text-white")
              }
            >
              { _id.slice(-6).toUpperCase()}
            </span>
          </th>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            { location }
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            { lastEmptied == null ? 'Never' : lastEmptied }
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            <i className="fas fa-circle text-orange-500 mr-2"></i> {currentVolume}/{maxVolume} cm<sup>3</sup>
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            <div className="flex items-center">
              <div className="relative w-full">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
              <span className="ml-2">{percentage}%</span>
            </div>
            {/* add time since full below */}
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            { assignedTo == null ? 'N/A' : assignedTo.name }
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
            <TableDropdown />
          </td>
        </tr>
      );
    });
  }
  
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                { content.type === 'bins' ? 'Bins': 'Users' }
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                { colHeaders }
              </tr>
            </thead>
            <tbody>
              { content.type === 'bins' ? binRows : userRows }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  content: PropTypes.object.isRequired,
};
