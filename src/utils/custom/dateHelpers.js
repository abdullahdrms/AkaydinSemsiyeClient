const days = (checkIn, checkOut) => {
  var zamanFark = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
  var gunFark = Math.ceil(zamanFark / (1000 * 3600 * 24));
  return gunFark;
};

const dateToString = (date) => {
  var dateString =
    date.getFullYear() +
    '-' +
    (date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) +
    '-' +
    (date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate().toString());
  return dateString;
};

const stringToDate = (date) => {
  const newDate = new Date(date)
  return newDate;
};

const formatDate = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return `${day}-${month}-${year}`;
};


const calculateBusinessDaysGetDay = (startDate,endDate) => {

  let geciciT = new Date(startDate);
  let totalDay = 0;

  while (geciciT <= new Date(endDate)) {
    geciciT.setDate(geciciT.getDate() + 1);
    if (geciciT.getDay() !== 0 && geciciT.getDay() !== 6) {
      totalDay++;
    }
  }

  return totalDay;
};

const calculateBusinessDays = (days) => {
  let currentDate = new Date();
  let addedDays = 0;

  while (addedDays < days) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      addedDays++;
    }
  }

  return currentDate;
};

const calculateBusinessDaysWithStart = (days, startDate) => {
  let currentDate = startDate
  let addedDays = 0;

  while (addedDays < days) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      addedDays++;
    }
  }

  return currentDate;
};

const calculateDaysBetweenDates = (date1) => {
  const date2 = new Date()
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInTime = date1.getTime() - date2.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
};

export { days, dateToString, stringToDate, formatDate, calculateBusinessDays, calculateDaysBetweenDates, calculateBusinessDaysWithStart,calculateBusinessDaysGetDay };
