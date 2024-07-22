/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetAllUser = () => {
    return get(`/User/GetAll`, true);
}

const AddUser = (fd) => {
    return post(`/User/Create`, fd, true, true)
}

const UpdateUser = (fd) => {
    return post(`/User/Update`, fd, true, true)
}

const UserRoleAsign = (fd) => {
    return post(`/User/UserRoleAsign`, fd, true, true)
}

export { GetAllUser, AddUser, UpdateUser, UserRoleAsign }