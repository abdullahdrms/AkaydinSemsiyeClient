/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const getSkeletonCharts = () => {
    return get(`/SkeletonCharts/GetList`, true);
}

export { getSkeletonCharts }