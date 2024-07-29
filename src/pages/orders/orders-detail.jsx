import { Box, Button, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import Loader from 'components/Loader'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PaymentAddModal from 'sections/facilities/PaymentAddModal'
import PaymentTable from 'sections/facilities/PaymentTable'
import ProductTable from 'sections/facilities/ProductTable'
import { GetDetail } from 'services/ordersServices'
import { calculateBusinessDays, calculateBusinessDaysWithStart, formatDate, stringToDate } from 'utils/custom/dateHelpers'

export default function OrderDetail() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const params = useParams();
    const navigate = useNavigate()
    const [paymentModal, setPaymentModal] = useState(false)
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay' }]

    useEffect(() => {
        GetDetail(params?.id).then((res) => {
            if (res?.data) {
                setData(res?.data)
            } else {
                navigate('/404')
            }
            setLoading(false)
        })
    }, [])


    if (loading) return <Loader open={loading} />

    return (
        <>
            <PaymentAddModal setIsEdit={setIsEdit} id={params?.id} open={paymentModal} modalToggler={setPaymentModal} />
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid marginTop={4} item xs={12}>
                <Grid marginBottom={5} gap={1.6} display={'flex'} justifyContent={'end'} item xs={12}>
                    <Button onClick={() => navigate(`/orders/work-form/${params?.id}`)} color='success' variant="contained">İş Formu</Button>
                    <Button onClick={() => navigate(`/orders/order-form/${params?.id}`)} color='primary' variant="contained">Sipariş Formu</Button>
                    <Button onClick={() => navigate(`/orders/update/${params.id}`)} color='warning' variant="contained">Siparişi Düzenle</Button>
                </Grid>
                <Grid container spacing={4.5}>
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="h4">
                                Sipariş Bilgileri
                            </Typography>
                            <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş No
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    #{data?.orderNumber}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Durumu
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    <Chip sx={{ borderRadius: 1, position: 'relative', top: 9 }} size="small" label={data?.orderStatusType === 1 ? 'Oluşturuldu' : data?.orderStatusType === 2 ? 'Başladı' : data?.orderStatusType === 3 ? 'Kısmi Hazır' : ''} variant="outlined" color={data?.orderStatusType === 1 ? 'success' : data?.orderStatusType === 2 ? 'success' : data?.orderStatusType === 3 ? 'warning' : 'error'} />
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Personel
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {data?.user?.name} {data?.user?.surname}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="h4">
                                Müşteri Bilgileri
                            </Typography>
                            <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Adı Soyadı
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    <Link sx={[{
                                        '&:hover': {
                                            color: "#009ef7",
                                            transition: 'color .2s ease'
                                        },
                                    }]} color="#7e86a6" underline='none' href="#">
                                        {data?.customer?.firstName} {data?.customer?.lastName} - {" "}
                                        <Chip sx={{ borderRadius: 1, position: 'relative', top: -1 }} size="small" label={data?.customer?.customerType === 1 ? 'Müşteri' : 'Bayi'} variant="outlined" color={data?.customer?.customerType === 1 ? 'warning' : 'primary'} />
                                    </Link>
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Email
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    <Link sx={[{
                                        '&:hover': {
                                            color: "#009ef7",
                                            transition: 'color .2s ease'
                                        },
                                    }]} color="#7e86a6" underline='none' href={`mailto:${data?.customer?.email}`}>
                                        {data?.customer?.email}
                                    </Link>
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Telefon
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">

                                    <Link sx={[{
                                        '&:hover': {
                                            color: "#009ef7",
                                            transition: 'color .2s ease'
                                        },
                                    }]} color="#7e86a6" underline='none' href={`tel:${data?.customer?.phone}`}>
                                        {data?.customer?.phone}
                                    </Link>
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="h4">
                                Teslimat Bilgileri
                            </Typography>
                            <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Tarihi
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {formatDate(stringToDate(data?.createdAt))}

                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Termin Tarihi
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {formatDate(stringToDate(data?.deadline))}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Teslim Yeri, Türü
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {data?.deliveryLocation === 1 ? 'Adres' : 'Depo'}, {data?.deliveryType === 1 ? 'Kargo' : 'Servis'}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid marginTop={0} container spacing={4.5}>
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%', minHeight: '220px' }}>
                            <Typography variant="h4" component="h4">
                                Müşteri Notları
                            </Typography>
                            <Typography sx={{ marginTop: 4 }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="body1" fontSize={14} component="span">
                                    {data?.customer?.customerNote}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%', minHeight: '220px' }}>
                            <Typography variant="h4" component="h4">
                                Sipariş Notları
                            </Typography>
                            <Typography sx={{ marginTop: 4 }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="body1" fontSize={14} component="span">
                                    {data?.orderNote}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%', minHeight: '220px' }}>
                            <Typography variant="h4" component="h4">
                                Teslim Yeri Detayları
                            </Typography>
                            <Typography sx={{ marginTop: 4 }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="body1" fontSize={14} component="span">
                                    {data?.deliveryLocationText}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid marginTop={4.5} item xs={12}>
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%', minHeight: '220px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Typography sx={{ position: 'relative', top: 8 }} variant="h4" component="h4">
                                Ürünler #{data?.orderNumber}
                            </Typography>
                            <Button onClick={() => navigate(`/orders/detail/select-product/${params.id}`)} sx={{ height: '46px', borderRadius: 1, pl: 3, pr: 3 }} size='small' variant="contained">Ürün Ekle</Button>
                        </div>

                        <ProductTable data={data?.orderDetails} />
                    </Box>
                </Grid>
                <Grid marginTop={4.5} item xs={12}>
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%', minHeight: '220px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Typography sx={{ position: 'relative', top: 8 }} variant="h4" component="h4">
                                Ödeme Detayları
                            </Typography>
                            <Button onClick={() => setPaymentModal(true)} sx={{ height: '46px', borderRadius: 1, pl: 3, pr: 3 }} color='success' size='small' variant="contained">Ödeme Ekle</Button>
                        </div>

                        <PaymentTable data={data?.orderDetails} isEdit={isEdit} setIsEdit={setIsEdit} id={params?.id} />
                    </Box>
                </Grid>
                <Grid marginTop={4.5} item xs={12}>
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%', minHeight: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Typography sx={{ position: 'relative', top: 8 }} variant="h4" component="h4">
                                Siparişe Ait Dosyalar
                            </Typography>
                            <Button sx={{ height: '46px', borderRadius: 1, pl: 3, pr: 3 }} size='small' variant="contained">Dosya Ekle</Button>
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
