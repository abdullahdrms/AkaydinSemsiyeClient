import { get, post, remove, put } from './request';


const GetOrders = ({ pageSize = 10, page = 1, searchVal = "", orderStatusType = null, price = null, orderDate = null, deadlineDate = null }) => {
    return get(`/Orders/GetList?size=${pageSize}&page=${page}&CustomerName=${searchVal}${orderStatusType !== null ? `&OrderStatusType=${orderStatusType}` : ''}${price !== null ? `&Price=${price}` : ''}${orderDate !== null ? `&OrderDate=${orderDate}` : ''}${deadlineDate !== null ? `&DeadlineDate=${deadlineDate}` : ''}`, true);
}

const CreateOrder = (fd) => {
    return post(`/Orders/Create`, fd, true, true);
}

const UpdateOrder = (fd) => {
    return post(`/Orders/Update`, fd, true, true);
}

const GetDetail = (id) => {
    return get(`/Orders/GetDetail?id=${id}`, true);
}

const GetOrderDetail = (id) => {
    return get(`/OrderDetails/GetDetail?id=${id}`, true);
}

const CreateCamellia = (fd) => {
    return post(`/OrderDetails/CreateCamellia`, fd, true, true);
}

const UpdateCamellia = (fd) => {
    return post(`/OrderDetails/UpdateCamellia`, fd, true, true);
}

const CreateLuxuryUmbrella = (fd) => {
    return post(`/OrderDetails/CreateLuxuryUmbrella`, fd, true, true);
}

const UpdateLuxuryUmbrella = (fd) => {
    return post(`/OrderDetails/UpdateLuxuryUmbrella`, fd, true, true);
}

const CreateEcoUmbrella = (fd) => {
    return post(`/OrderDetails/CreateEcoUmbrella`, fd, true, true);
}

const UpdateEcoUmbrella = (fd) => {
    return post(`/OrderDetails/UpdateEcoUmbrella`, fd, true, true);
}

const CreateSidePoloUmbrella = (fd) => {
    return post(`/OrderDetails/CreateSidePoloUmbrella`, fd, true, true);
}

const UpdateSidePoloUmbrella = (fd) => {
    return post(`/OrderDetails/UpdateSidePoloUmbrella`, fd, true, true);
}

const CreateClassicUmbrella = (fd) => {
    return post(`/OrderDetails/CreateClassicUmbrella`, fd, true, true);
}

const UpdateClassicUmbrella = (fd) => {
    return post(`/OrderDetails/UpdateClassicUmbrella`, fd, true, true);
}

const CreateSparePartsService = (fd) => {
    return post(`/OrderDetails/CreateSparePartsService`, fd, true, true);
}

const UpdateSparePartsService = (fd) => {
    return post(`/OrderDetails/UpdateSparePartsService`, fd, true, true);
}

const CreateWoodenUmbrella = (fd) => {
    return post(`/OrderDetails/CreateWoodenUmbrella`, fd, true, true);
}

const UpdateWoodenUmbrella = (fd) => {
    return post(`/OrderDetails/UpdateWoodenUmbrella`, fd, true, true);
}

const CreateBeachUmbrella = (fd) => {
    return post(`/OrderDetails/CreateBeachUmbrella`, fd, true, true);
}

const UpdateBeachUmbrella = (fd) => {
    return post(`/OrderDetails/UpdateBeachUmbrella`, fd, true, true);
}

const DeleteUmrella = (fd) => {
    return post(`/OrderDetails/Delete`, fd, true, true);
}

const GetOrderDeliveryList = (fd) => {
    return post(`/Orders/GetOrderDeliveryList`, fd, true, true);
}

const GetListDeadline = (id) => {
    return get(`/Orders/GetListDeadline`, true);
}

const GetOrderListAll = ({ page, size }) => {
    return get(`/Orders/GetOrderListAll?Page=${page}&Size=${size}`, true);
}


export { GetOrders, CreateOrder, GetDetail, UpdateOrder, CreateCamellia, CreateLuxuryUmbrella, CreateEcoUmbrella, CreateSidePoloUmbrella, CreateClassicUmbrella, CreateSparePartsService, CreateWoodenUmbrella, CreateBeachUmbrella, GetOrderDetail, DeleteUmrella, UpdateCamellia, UpdateLuxuryUmbrella, UpdateEcoUmbrella, UpdateSidePoloUmbrella, UpdateClassicUmbrella, UpdateSparePartsService, UpdateWoodenUmbrella, UpdateBeachUmbrella, GetOrderDeliveryList, GetListDeadline, GetOrderListAll }
