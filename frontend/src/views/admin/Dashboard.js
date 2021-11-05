import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "context/DataContext";

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardTable from "components/Cards/CardTable.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

export default function Dashboard() {

  const { binList, userList, socketIoBinUpdate } = useContext(DataContext);
  // const binMap = {}; // map id to bin data to do constant time updates?
  const [binTableContent, setBinTableContent] = useState({
    type: 'bins',
    headers: ['ID', 'Location', 'Last Emptied', 'Current Volume', 'Progress to Full', 'Assigned To'],
    list: binList,
  });
  const userTableContent = {
    type: 'users',
    headers: ['Name', 'Role'],
    list: userList,
  }
  // const binTableContent = {
  //   type: 'bins',
  //   headers: ['ID', 'Location', 'Last Emptied', 'Current Volume', 'Progress to Full', 'Assigned To'],
  //   list: binList,
  // }

  useEffect(() => {
    if (socketIoBinUpdate) {
      const { binId, currentHeight } = socketIoBinUpdate;
      for (let bin of binTableContent.list) {
        if (bin._id === binId) {
          bin.currentHeight = currentHeight;
          break;
        }
      }
      setBinTableContent(binTableContent);
    }
  }, [binTableContent, socketIoBinUpdate]);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" content={binTableContent}/>
        </div>
        <div className="w-full mb-12 px-4">
          <CardTable content={userTableContent}/>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div>
      </div>
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
