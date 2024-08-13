import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';


export default function ProductTable({ data }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    function navigateHandle(row) {
        if (row?.id) {
            navigate(`/orders/detail/product-detail/${row?.id}`)
        }
    }

    useEffect(() => {
        if (data) {
            let totalPrice = 0
            let totalTaxPrice = 0
            data?.map((item, i) => {
                totalPrice = totalPrice + (item?.price * item?.qty)
                totalTaxPrice = totalTaxPrice + (((item?.price * item?.qty) * item?.tax) / 100)
                const data1 = {
                    id: item?.id,
                    name: item?.product?.name,
                    orderStatus: <Chip key={i} size='small' sx={{ borderRadius: 1 }} label={item?.orderDetailStatus === 1 ? 'Ürün Başladı' : item?.orderDetailStatus === 2 ? 'Kumaş Hazır' : item?.orderDetailStatus === 3 ? 'İskelet Hazır' : item?.orderDetailStatus === 4 ? "Ürün Hazır" : ''} color={item?.orderDetailStatus === 1 ? 'primary' : item?.orderDetailStatus === 2 ? 'info' : item?.orderDetailStatus === 3 ? 'secondary' : item?.orderDetailStatus === 4 ? "success" : 'warning'} />,
                    qty: item?.qty,
                    price: item?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' TL',
                    total: (item?.price * item?.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' TL',
                    font: 'normal',
                    icon: item?.product?.icon
                }
                setRows((prevValues) => [...prevValues, data1])
                if (data?.length === (i + 1)) {
                    const data2 = {
                        name: "",
                        desc: "",
                        orderStatus: "",
                        qty: "",
                        price: "Toplam",
                        total: `${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL`,
                        font: 'bold'
                    }
                    setRows((prevValues) => [...prevValues, data2])
                    const data3 = {
                        name: "",
                        desc: "",
                        orderStatus: "",
                        qty: "",
                        price: "Kdv",
                        total: `${totalTaxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL`,
                        font: 'bold'
                    }
                    setRows((prevValues) => [...prevValues, data3])
                    const data4 = {
                        name: "",
                        desc: "",
                        orderStatus: "",
                        qty: "",
                        price: "Genel Toplam",
                        total: `${(totalTaxPrice + totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL`,
                        font: 'bold'
                    }
                    setRows((prevValues) => [...prevValues, data4])
                }
            })
            setLoading(false)
        }
    }, [data])


    return (
        <TableContainer component={Paper}>
            {
                loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <CircularProgress style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '20px' }} /></div> :
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ minWidth: '150px' }} >Ürün</TableCell>
                                <TableCell align="right">SIPARIŞ DURUMU</TableCell>
                                <TableCell align="right">ADET</TableCell>
                                <TableCell align="right">FIYAT</TableCell>
                                <TableCell align="right">TOPLAM</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => (
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => navigateHandle(row)} key={i}>
                                    <TableCell style={{ display: `${row?.icon ? 'flex' : 'table-cell'}`, alignItems: `${row?.icon ? 'center' : 'normal'}`, gap: `${row?.icon ? '15px' : '0px'}` }} component="th" scope="row">
                                        {
                                            row?.icon &&
                                            <img style={{ objectFit: 'contain' }} width='50px' height='50px' src={`/img/products/${row?.icon}`} alt="" />
                                        }
                                        <span>{row.name}</span>
                                    </TableCell>
                                    <TableCell align="right">{row.orderStatus}</TableCell>
                                    <TableCell align="right">{row.qty}</TableCell>
                                    <TableCell style={{ fontWeight: row?.font }} align="right">{row.price}</TableCell>
                                    <TableCell style={{ fontWeight: row?.font }} align="right">{row.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }
        </TableContainer>
    );
}
