import React, { useEffect, useState } from "react";

const Timer = ({ dropOffEpoch }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(dropOffEpoch)
  );

  function calculateTimeRemaining(epochTime) {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeDiff = epochTime - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Time has passed
    }

    const days = Math.floor(timeDiff / (3600 * 24));
    const hours = Math.floor((timeDiff % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(dropOffEpoch));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [dropOffEpoch]);

  const formatTime = (value) => String(value).padStart(2, "0"); // Ensure two digits

  // Format the display based on the remaining time
  const timeDisplay =
    timeRemaining.days > 0
      ? `${formatTime(timeRemaining.days)} ${
          timeRemaining.days > 1 ? "days" : "day"
        } remaining`
      : `${formatTime(timeRemaining.hours)} ${
          timeRemaining.hours > 1 ? "hours" : "hour"
        } remaining`;

  return (
    <span className="w-[140px] h-[30px] bg-red-500/10 text-red-500 flex items-center justify-center rounded-md">
      {timeRemaining.days === 0 &&
      timeRemaining.hours === 0 &&
      timeRemaining.minutes === 0 &&
      timeRemaining.seconds === 0
        ? "00:00"
        : [
            timeRemaining.days > 0 && `${timeRemaining.days}d`,
            timeRemaining.hours > 0 && `${timeRemaining.hours}h`,
            timeRemaining.minutes > 0 && `${timeRemaining.minutes}m`,
          ]
            .filter(Boolean) // Remove falsy values (e.g., `false` or `undefined`)
            .join(" ") + " left"}
    </span>
  );
};

export default Timer;
