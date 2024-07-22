/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetRoles = () => {
    return get(`/Role/GetAll`, true);
}

const CreateRole = (fd) => {
    return post(`/Role/Create`, fd, true, true);
}

export { GetRoles, CreateRole }
