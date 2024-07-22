/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetAllProducts = () => {
    return get(`/Products/GetList`, true);
}


export { GetAllProducts }