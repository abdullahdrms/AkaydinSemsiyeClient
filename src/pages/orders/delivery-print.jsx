import { Box, Button, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import Loader from 'components/Loader'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import PaymentAddModal from 'sections/facilities/PaymentAddModal'
import PaymentTable from 'sections/facilities/PaymentTable'
import ProductTable from 'sections/facilities/ProductTable'
import { GetDetail } from 'services/ordersServices'
import { formatDate, stringToDate } from 'utils/custom/dateHelpers'

export default function DeliveryPrint() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const params = useParams();
    const location = useLocation()

    console.log(location.search.replace('?id=', ""));

    const navigate = useNavigate()
    const [paymentModal, setPaymentModal] = useState(false)
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Teslimat Listesi' }]

    useEffect(() => {
        // GetDetail(params?.id).then((res) => {
        //     if (res?.data) {
        //         setData(res?.data)
        //     } else {
        //         navigate('/404')
        //     }

        // })
        setLoading(false)
    }, [])

    if (loading) return <Loader open={loading} />

    return (
        <>
            <PaymentAddModal setIsEdit={setIsEdit} id={params?.id} open={paymentModal} modalToggler={setPaymentModal} />
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid marginTop={4} item xs={12}>
                {/* <Grid marginBottom={5} gap={1.6} display={'flex'} justifyContent={'end'} item xs={12}>
                    <Button color='success' variant="contained">İş Formu</Button>
                    <Button color='primary' variant="contained">Sipariş Formu</Button>
                    <Button onClick={() => navigate(`/orders/update/${params.id}`)} color='warning' variant="contained">Siparişi Düzenle</Button>
                </Grid> */}
                <Grid container spacing={4.5}>
                    <Grid item xs={12} lg={12}>
                        <Box sx={{ bgcolor: 'white', p: 6, borderRadius: 1, height: '100%' }}>
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
                                        <p style={{ textAlign: 'end', fontSize: '16px' }}>GÜNGÖREN MAH. YAPIT SOK NO:24 TAŞDELEN ÇEKMEKÖY/İSTANBUL</p>
                                        <p style={{ textAlign: 'end', fontSize: '16px' }}>0216 429 84 97</p>
                                        <p style={{ textAlign: 'end', fontSize: '16px' }}>0850 495 52 33</p>
                                    </span>
                                </div>

                            </div>
                            <p style={{ color: '#a1a5b7' }}>Siparişler</p>
                            <Divider sx={{ marginTop: 2 }} orientation="horizontal" variant="fullWidth" flexItem />

                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
