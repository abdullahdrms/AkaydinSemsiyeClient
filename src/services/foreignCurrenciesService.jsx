/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetAllForeign = ({ page, size, year }) => {
    return get(`/ForeignCurrencies/GetList?year=${year}&Page=${page}&Size=${size}`, true);
}

const AddForeign = (fd) => {
    return post(`/ForeignCurrencies/Create`, fd, true, true)
}

const UpdateForeign = (fd) => {
    return post(`/ForeignCurrencies/Update`, fd, true, true)
}

export { GetAllForeign, AddForeign, UpdateForeign }