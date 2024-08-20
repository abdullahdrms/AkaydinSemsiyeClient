/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetCustomerAdress = (id) => {
    return get(`/CustomerAddresses/GetListByCustomer?customerId=${id}`, true);
}


const AddCustomerAdress = (fd) => {
    return post(`/CustomerAddresses/Create`, fd, true, true);
}

const UpdateCustomerAdress = (fd) => {
    return post(`/CustomerAddresses/Update`, fd, true, true);
}

export { GetCustomerAdress, AddCustomerAdress, UpdateCustomerAdress }