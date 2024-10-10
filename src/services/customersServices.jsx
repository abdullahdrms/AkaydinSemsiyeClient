/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetAllCustomer = () => {
    return get(`/Customers/GetList?Page=0&Size=9999`, true);
}

const GetFilterCustomer = ({ customerType = 1, page, size }) => {
    return get(`/Customers/GetList?customerType=${customerType}&Page=${page}&Size=${size}`, true);
}

const GetCustomerDetail = (id) => {
    return get(`/Customers/GetDetail?Id=${id}`, true);
}

const AddCustomer = (fd) => {
    return post(`/Customers/Create`, fd, true, true)
}

const UpdateCustomer = (fd) => {
    return post(`/Customers/Update`, fd, true, true)
}



export { GetAllCustomer, AddCustomer, GetCustomerDetail, GetFilterCustomer, UpdateCustomer }