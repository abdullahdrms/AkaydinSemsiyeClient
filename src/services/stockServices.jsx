/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const getStocks = () => {
    return get(`/Stocks/GetList`, true);
}

const createStock = (fd) => {
    return post(`/Stocks/Create`, fd, true, true);
}

const updateStock = (fd) => {
    return post(`/Stocks/Update`, fd, true, true);
}

const getMaterials = () => {
    return get(`/Materials/GetList`, true);
}

const createMaterials = (fd) => {
    return post(`/Materials/Create`, fd, true, true);
}

const updateMaterial = (fd) => {
    return post(`/Materials/Update`, fd, true, true);
}

const getSemiFinished = ({ page, size, storage = 0, stockType = 0 }) => {
    return get(`/SemiFinished/GetList?Pagination.Page=${page}&Pagination.Size=${size}${storage !== 0 ? `&Storages=${storage}` : ''}${stockType !== 0 ? `&StockType=${stockType}` : ''}`, true);
}

const createSemiFinished = (fd) => {
    return post(`/SemiFinished/Create`, fd, true, true);
}

const updateSemiFinished = (fd) => {
    return post(`/SemiFinished/Update`, fd, true, true);
}

const getListStockControl = (fd) => {
    return post(`/SemiFinished/GetListStockControl`, fd, true, true);
}

const restoreStock = (fd) => {
    return post(`/SemiFinished/RestoreStock`, fd, true, true);
}

const getSemiFinishedDetail = (id) => {
    return get(`/SemiFinished/GetDetail?id=${id}`, true);
}


export { getStocks, createStock, updateStock, getMaterials, getSemiFinished, createMaterials, updateMaterial, createSemiFinished, updateSemiFinished, getListStockControl, restoreStock, getSemiFinishedDetail }