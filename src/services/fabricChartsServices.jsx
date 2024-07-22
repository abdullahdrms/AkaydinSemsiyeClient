/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const getFabricCharts = () => {
    return get(`/FabricCharts/GetList`, true);
}

export { getFabricCharts }