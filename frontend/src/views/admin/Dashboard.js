import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "context/DataContext";

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardTable from "components/Cards/CardTable.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

export default function Dashboard() {

  const { binList, userList } = useContext(DataContext);
  // const binMap = {}; // map id to bin data to do constant time updates?
  const binTableContent = {
    type: 'bins',
    headers: ['ID', 'Location', 'Last Emptied', 'Current Volume', 'Progress to Full', 'Assigned To'],
  };
  const userTableContent = {
    type: 'users',
    headers: ['Name', 'Role'],
  }

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" content={binTableContent} list={binList}/>
        </div>
        <div className="w-full mb-12 px-4">
          <CardTable content={userTableContent} list={userList}/>
        </div>
      </div>
      {/* <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div>
      </div> */}
      {/* <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div>
      </div> */}
    </>
  );
}
