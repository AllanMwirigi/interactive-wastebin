import React from "react";
import PropTypes from "prop-types";

// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { Link } from "react-router-dom";
import { getProgressColors } from "utils/utils";

export default function CardTable({ color, content, list }) {

  const colHeaders = content.headers.map((col) =>
    <th key={col}
      className={
        "px-6 align-middle border border-solid py-3 text-base uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
        (color === "light"
          ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
          : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
      }
    >
      {col}
    </th>
  );

  const viewBin = (bin) => {
    // console.log('bin clicked')
  }

  let userRows = []; let binRows = [];
  if (content.type === 'users') {
      userRows = list.map((user) =>
        <tr key={ user._id }>
          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4 text-left flex items-center">
            <span
              className={
                "ml-3 font-bold " +
                +(color === "light" ? "text-blueGray-600" : "text-white")
              }
            >
              {user.name}
            </span>
          </th>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
            { user.role }
          </td>
        </tr>
    );
  } else {
    binRows = list.map((bin) => {
      const { _id, width, length, maxHeight, currentHeight, lastEmptied, location, assignedTo } = bin;
      const maxVolume = length * width * maxHeight;
      let currentVolume = length * width * currentHeight;
      currentVolume = Math.min(currentVolume, maxVolume);
      let percentage = Math.ceil((currentHeight/maxHeight)*100);
      percentage = Math.min(percentage, 100);
      const { volumeColor, badgeColor } = getProgressColors(percentage);

      return (
        
        <tr key={ _id } onClick={(_event) => viewBin(bin)}>
          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4 text-left flex items-center">
            <Link to={{ pathname: "/admin/bin", state: {bin}}}>
              <span
                className={
                  "ml-3 font-bold " +
                  +(color === "light" ? "text-blueGray-600" : "text-white")
                }
              >
                { _id.slice(-6).toUpperCase()}
              </span>
            </Link>
          </th>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
            { location }
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
            { lastEmptied == null ? 'Never' : lastEmptied }
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
            <i className={`fas fa-circle ${badgeColor} mr-2`}></i> {currentVolume}/{maxVolume} cm<sup>3</sup>
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
            <div className="flex items-center">
              <div className="relative w-full">
                <div className="overflow-hidden h-2 text-base flex rounded bg-blueGray-50">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${volumeColor}`}
                  ></div>
                </div>
              </div>
              <span className="ml-2">{percentage}%</span>
            </div>
            {/* TODO: add time since full below */}
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
            { assignedTo == null ? 'N/A' : assignedTo.name }
          </td>
          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4 text-right">
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