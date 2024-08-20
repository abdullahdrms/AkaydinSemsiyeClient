import { get } from './request';

const getMonthlyStats = ({ month, year }) => {
    return get(`/Statistics/GetMonthStatistics?year=${year}&month=${month}&currencyType=1`, true);
}

const getYearlyStats = ({ year }) => {
    return get(`/Statistics/GetYearStatistics?year=${year}&currencyType=1`, true);
}

const getGeneralStats = ({ firstYear, lastYear }) => {
    return get(`/Statistics/GetGlobalStatistics?firstYear=${firstYear}&lastYear=${lastYear}&currencyType=1`, true);
}

const getGlobalCount = () => {
    return get(`/Statistics/GetGlobalCount`, true);
}

const getYearOrderCount = () => {
    return get(`/Statistics/GetHomeYearOrderCount`, true);
}

const getBestProductYearCount = () => {
    return get(`/Statistics/GetBestProductYearCount`, true);
}

const getBestProductMonthCount = () => {
    return get(`/Statistics/GetBestProductMonthCount`, true);
}


export { getMonthlyStats, getYearlyStats, getGeneralStats, getGlobalCount, getYearOrderCount, getBestProductYearCount, getBestProductMonthCount }