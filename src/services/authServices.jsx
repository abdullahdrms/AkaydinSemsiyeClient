/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';




const LoginService = (fd) => {
    return post(`/Auth/Login`, fd, true, true)
}


export { LoginService }