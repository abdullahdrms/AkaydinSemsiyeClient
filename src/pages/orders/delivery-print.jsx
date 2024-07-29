import { Box, Button, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import Loader from 'components/Loader'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import PaymentAddModal from 'sections/facilities/PaymentAddModal'
import PaymentTable from 'sections/facilities/PaymentTable'
import ProductTable from 'sections/facilities/ProductTable'
import { GetDetail, GetOrderDeliveryList } from 'services/ordersServices'
import { formatDate, stringToDate } from 'utils/custom/dateHelpers'
import ReactToPrint, { useReactToPrint } from 'react-to-print'

export default function DeliveryPrint() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const params = useParams();
    const location = useLocation()


    const ids = location.search.replace('?id=', "")
    const splitIds = ids.split(',')

    const componentRef = useRef(null)

    const navigate = useNavigate()
    const [paymentModal, setPaymentModal] = useState(false)
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Teslimat Listesi' }]

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        const fd = new FormData()
        splitIds.map((item, i) => {
            fd.append(`orderIds[${i}]`, item)
        })
        GetOrderDeliveryList(fd).then((res) => {
            setData(res?.data)
            setLoading(false)
        })

    }, [])

    if (loading) return <Loader open={loading} />

    return (
        <>
            <PaymentAddModal setIsEdit={setIsEdit} id={params?.id} open={paymentModal} modalToggler={setPaymentModal} />
            {/* <Breadcrumbs custom links={breadcrumbLinks} /> */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumbs custom links={breadcrumbLinks} />
                <Button onClick={() => handlePrint()} sx={{ height: '36px', borderRadius: 1, pl: 3, pr: 3 }} size='small' variant="contained">Siparişi Yazdır</Button>
            </div>
            <Grid marginTop={4} item xs={12}>
                {/* <Grid marginBottom={5} gap={1.6} display={'flex'} justifyContent={'end'} item xs={12}>
                    <Button color='success' variant="contained">İş Formu</Button>
                    <Button color='primary' variant="contained">Sipariş Formu</Button>
                    <Button onClick={() => navigate(`/orders/update/${params.id}`)} color='warning' variant="contained">Siparişi Düzenle</Button>
                </Grid> */}
                <Grid container spacing={4.5}>
                    <Grid item xs={12} lg={12}>
                        <Box ref={componentRef} sx={{ bgcolor: 'white', p: 6, borderRadius: 1, height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h2 style={{ textAlign: 'start', color: '#3f4254', fontSize: '27px' }}>Teslimat Listesi</h2>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                                    <div style={{ maxWidth: '150px', marginBottom: '16px' }}>
                                        <a href='/'>
                                            <img width="100%" src="/img/akaydin-logo.png" alt="" />
                                        </a>
                                    </div>
                                    <span style={{ color: '#a1a5b7' }}>
                                        <p style={{ textAlign: 'end', fontSize: '16px', margin: 0 }}>GÜNGÖREN MAH. YAPIT SOK NO:24 TAŞDELEN ÇEKMEKÖY/İSTANBUL</p>
                                        <p style={{ textAlign: 'end', fontSize: '16px', margin: 0 }}>0216 429 84 97</p>
                                        <p style={{ textAlign: 'end', fontSize: '16px', margin: 0 }}>0850 495 52 33</p>
                                    </span>
                                </div>

                            </div>
                            <p style={{ color: '#a1a5b7' }}>Siparişler</p>
                            <Divider sx={{ marginTop: 2 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <div style={{ marginTop: '25px' }}>
                                {
                                    data?.map((item, i) => {
                                        return (
                                            <div key={i} style={{ marginBottom: '36px' }} >
                                                <table style={{ width: '100%', borderSpacing: 0, border: '1px solid black' }}>
                                                    <thead style={{ width: '100%', textAlign: 'start', borderSpacing: 0 }}>
                                                        <tr style={{ borderSpacing: 0 }}>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Sipariş No</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Teslim Yeri</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Sipariş Notu</th>
                                                            {/* <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Kumaş-Renk</th>
                                                    <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İskelet-Renk</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ width: '100%', textAlign: 'start' }}>
                                                        <tr>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>#{item?.orderNumber}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.customDeliveryLocationText}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.orderNote !== null ? item?.orderNote : ""}</td>
                                                            {/* <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>tst</td>
                                                    <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>tst</td> */}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{ width: '100%', borderSpacing: 0, borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black' }}>
                                                    <thead style={{ width: '100%', textAlign: 'start', borderSpacing: 0 }}>
                                                        <tr style={{ borderSpacing: 0 }}>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Adı Soyadı</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Telefon</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Kalan Bakiye</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ width: '100%', textAlign: 'start' }}>
                                                        <tr>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>{item?.customer?.firstName} {item?.customer?.lastName}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.customer?.phone}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>

                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
