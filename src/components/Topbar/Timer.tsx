import React, { useEffect, useState } from 'react';

import { FiPause, FiPlay, FiRefreshCcw } from 'react-icons/fi';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { LuAlarmClock } from 'react-icons/lu';

import { ToolTip } from '../ui';

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center justify-center h-8 text-[#fff9]">
      {isRunning || time !== 0 ? (
        <div className="flex items-center h-8">
          <div
            className="flex rounded-l-md bg-[#222] p-1.5 h-8 justify-center items-center cursor-pointer"
            onClick={() => {
              setIsRunning(false);
              setTime(0);
            }}>
            <HiOutlineChevronLeft />
          </div>
          <div className="bg-[#222] flex items-center space-x-2 h-8 justify-center p-1.5 mx-[1px]">
            {isRunning ? (
              <ToolTip message="Pause">
                <FiPause onClick={() => setIsRunning(false)} className="cursor-pointer" />
              </ToolTip>
            ) : (
              <ToolTip message="Play">
                <FiPlay onClick={() => setIsRunning(true)} className="cursor-pointer" />
              </ToolTip>
            )}
            <span>{formatTime(time)}</span>
          </div>
          <ToolTip message="Reset">
            <div
              className="rounded-r-md bg-dark-fill-3 p-1.5 cursor-pointer h-8 flex justify-center items-center"
              onClick={() => setTime(0)}>
              <FiRefreshCcw />
            </div>
          </ToolTip>
        </div>
      ) : (
        <ToolTip message="Start Timer">
          <div
            className="flex items-center rounded cursor-pointer p-1 ease-in-out transition duration-300 hover:bg-dark-fill-3 h-8 justify-center"
            onClick={() => setIsRunning(true)}>
            <LuAlarmClock className="h-5 w-5" />
          </div>
        </ToolTip>
      )}
    </div>
  );
};

export default Timer;
