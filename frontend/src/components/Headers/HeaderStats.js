import React, { useContext, useEffect } from "react";

// components

import CardStats from "components/Cards/CardStats.js";
import { DataContext } from "context/DataContext";

export default function HeaderStats(props) {

  // const { binCountSet } = useContext(DataContext);

  // let binCount = "0";
  // if (binCountSet.size > 0) {
  //   binCount = binCountSet.size.toString();
  // }
  let binCount = "0";
  if (props.binCount > 0) {
    binCount = props.binCount.toString();
  }
  let userCount = "N/A";
  if (props.userCount > -1) {
    userCount = props.userCount.toString();
  }

  return (
    <>
      {/* Header */}
      {/* <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12"> */}
      <div className="relative bg-lightBlue-600 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Full Bins"
                  statTitle={binCount}
                  statArrow="up"
                  statPercent="3.48"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                    statSubtitle="Users"
                    statTitle={userCount}
                    statArrow="down"
                    statPercent="1.10"
                    statPercentColor="text-orange-500"
                    statDescripiron="Since yesterday"
                    statIconName="fas fa-users"
                    statIconColor="bg-pink-500"
                  />
              </div>
              {/* <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="NEW USERS"
                  statTitle="2,356"
                  statArrow="down"
                  statPercent="3.48"
                  statPercentColor="text-red-500"
                  statDescripiron="Since last week"
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PERFORMANCE"
                  statTitle="49,65%"
                  statArrow="up"
                  statPercent="12"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName="fas fa-percent"
                  statIconColor="bg-lightBlue-500"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
