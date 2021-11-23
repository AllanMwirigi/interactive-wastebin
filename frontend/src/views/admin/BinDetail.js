import MapExample from 'components/Maps/MapExample';
import { DataContext } from 'context/DataContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { getProgressColors } from 'utils/utils';

export function BinDetail() {

  const { bin } = useLocation().state;
  const { socketIoBinUpdate } = useContext(DataContext);
  const { crossSectionArea, maxHeight, currentHeight, location, lastEmptied, assignedTo } = bin;
  const maxVolume = Math.ceil(crossSectionArea * maxHeight);
  const [currentVolume, setCurrentVolume] = useState( Math.ceil( Math.max( Math.min( crossSectionArea * currentHeight, maxVolume ), 0 )));
  const [percentage, setPercentage] = useState( Math.ceil( Math.max( Math.min( (currentHeight/maxHeight)*100, 100), 0) ) );
  const binShortId = bin._id.slice(-6).toUpperCase();
  const { volumeColor, badgeColor } = getProgressColors(percentage);
  const [volumeProgressColor, setVolumeProgressColor] = useState(volumeColor);
  const [volumeBadgeColor, setVolumeBadgeColor] = useState(badgeColor);
  // TODO: IMPORTANT!! - react prevent child component (Map) rerender https://stackoverflow.com/questions/64841680/prevent-child-rerendering-if-parent-is-rerendered-using-hooks
  // let currentVolume = length * width * currentHeight;
  // currentVolume = Math.min(currentVolume, maxVolume);
  // let percentage = Math.ceil((currentHeight/maxHeight)*100);
  // percentage = Math.min(percentage, 100);

  useEffect(() => {
    if (socketIoBinUpdate != null) {
      const { binId, currentHeight } = socketIoBinUpdate;
      if (bin._id === binId) {
        bin.currentHeight = currentHeight;
        let newCurrentVolume = crossSectionArea * currentHeight;
        newCurrentVolume = Math.ceil(Math.min(newCurrentVolume, maxVolume));
        let newPercentage = Math.ceil((currentHeight/maxHeight)*100);
        newPercentage = Math.min(newPercentage, 100);
        setCurrentVolume(newCurrentVolume);
        setPercentage(newPercentage);
        const { volumeColor, badgeColor } = getProgressColors(newPercentage);
        setVolumeProgressColor(volumeColor);
        setVolumeBadgeColor(badgeColor);
      }
    }
    
  }, [bin, socketIoBinUpdate]);

  return( 
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-lightBlue-900 text-white"
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={"font-semibold text-lg text-white"}>
                Bin { binShortId }
              </h3>
            </div>
          </div>
          <div>
          <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
            Location: <strong>{ location }</strong>
          </div>
          <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
            Last Emptied: <strong>{ lastEmptied == null ? 'Never' : lastEmptied }</strong>
          </div>
          <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
            Assigned To: <strong>{ assignedTo == null ? 'N/A' : assignedTo.name }</strong>
          </div>
          <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
            <i className={`fas fa-circle ${volumeBadgeColor} mr-2`}></i> Current Volume: <strong>{currentVolume}/{maxVolume} cm<sup>3</sup></strong>
          </div>
          <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
            <div className="flex items-center">
              <div className="relative w-full">
                <div className="overflow-hidden h-2 flex rounded bg-blueGray-50">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${volumeProgressColor}`}
                    // className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
              <span className="ml-2">{percentage}% Full</span>
            </div>
            {/* TODO: add time since full below */}
          </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <MapExample binShortId={binShortId} />
          </div>
        </div>
      </div>

    </>
  );
}