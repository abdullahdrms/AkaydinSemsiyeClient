import { get } from './request';

const getMonthlyStats = ({ month, year ,currencyType}) => {
    return get(`/Statistics/GetMonthStatistics?year=${year}&month=${month}&currencyType=${currencyType}`, true);
}

const getYearlyStats = ({ year, currencyType }) => {
    return get(`/Statistics/GetYearStatistics?year=${year}&currencyType=${currencyType}`, true);
}

const getGeneralStats = ({ firstYear, lastYear, currencyType }) => {
    return get(`/Statistics/GetGlobalStatistics?firstYear=${firstYear}&lastYear=${lastYear}&currencyType=${currencyType}`, true);
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