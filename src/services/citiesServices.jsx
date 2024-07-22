/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const getCities = () => {
    return get(`/Cities/GetList`, true);
}

const getState = (id) => {
    return get(`/States/GetList?cityId=${id}`, true);
}


export { getCities, getState }