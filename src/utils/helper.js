export function convertToEpochTime(time12h, date = new Date()) {
  // Split time into components
  const [time, modifier] = time12h.split(" "); // Split time and AM/PM
  let [hours, minutes] = time.split(":").map(Number);

  // Adjust hours for PM and 12 AM
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  // Set the time components into the date
  date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds

  // Convert to epoch time (in seconds)
  return Math.floor(date.getTime() / 1000);
}

export const filterWeeks = (selectedDays) => {
  const filteredDays = selectedDays?.filter((day) => day !== "All Day");
  return filteredDays;
};

export function convertEpochToMMDDYYYY(epochTime) {
  if (epochTime == null) return "Invalid Date";

  // Convert epoch time to milliseconds
  const date = new Date(epochTime * 1000);

  // Extract month, day, and year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export function convertEpochTo12HourFormat(epochTime) {
  if (epochTime == null) return "Invalid Time";
  // Convert epoch time to milliseconds
  const date = new Date(epochTime * 1000);

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM and adjust hours
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight

  // Format hours and minutes as two-digit strings
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${modifier}`;
}

export function formatDateToMMDDYYYY(date) {
  if (date == null) return "Invalid Date";
  const newDate = new Date(date);
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(newDate.getDate()).padStart(2, "0");
  const year = newDate.getFullYear();

  return `${month}/${day}/${year}`;
}

export function formatEpochToMMDDYYYY(epoch) {
  if (epoch == null || isNaN(epoch)) return "Invalid Date";
  const newDate = new Date(epoch); // Create a date from the epoch timestamp
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(newDate.getDate()).padStart(2, "0");
  const year = newDate.getFullYear();

  return `${month}/${day}/${year}`;
}

export function convertToUTCTimestamp(dateString, dayTime = "start") {
  if (!dateString) return "Invalid Date";
  console.log(dateString);

  // Create the date object in UTC
  // const [year, month, day] = dateString.split("/").map(Number);
  // if (!year || !month || !day) return "Invalid Date";

  let date = new Date(dateString);
  // console.log(date);

  // if (isNaN(date)) return "Invalid Date";

  // // Set the time to midnight UTC
  // if (dayTime == "end") {
  //   date.setUTCHours(23, 59, 59, 999);
  // } else {
  //   date.setUTCHours(0, 0, 0, 0);
  // }

  console.log(date);

  // Convert to ISO string and return the timestamp
  return `${date}`;
}

export function convertEpochToTimeObject(epochTime) {
  const date = new Date(epochTime * 1000); // Convert epoch time to milliseconds
  let hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour to 12-hour format
  hour = hour % 12 || 12;

  // Ensure double-digit format for hour and minute
  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return `${formattedHour + ":" + formattedMinute + " " + period}`;
}

export function getStatusClasses(status) {
  const statusClasses = {
    pending: "text-yellow-500",
    "in-progress": "text-blue-500",
    incomplete: "text-red-500",
    "over-due": "text-orange-600",
    completed: "text-green-500",
    cancelled: "text-gray-400",
    rejected: "text-red-500",
  };

  // Return the class based on the status or a default class if status is unrecognized
  return statusClasses[status] || "text-gray-500";
}

export function getDetailedStatusClasses(status) {
  const statusClasses = {
    pending: "bg-yellow-500/10 text-yellow-500",
    "in-progress": "bg-blue-500/10 text-blue-500",
    incomplete: "bg-red-500/10 text-red-500",
    "over-due": "bg-oange-500/10 text-orange-600",
    completed: "bg-green-500/10 text-green-500",
    cancelled: "bg-gray-500/10 text-gray-400",
    rejected: "bg-red-500/10 text-red-500",
  };

  // Return the class based on the status or a default class if status is unrecognized
  return statusClasses[status] || "bg-gray-500/10 text-gray-500";
}
