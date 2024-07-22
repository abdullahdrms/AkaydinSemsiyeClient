import { Box, Button, Chip, Divider, Grid, IconButton, Link, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import Loader from 'components/Loader'
import { Printer } from 'iconsax-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import ReactToPrint, { useReactToPrint } from 'react-to-print'
import PaymentAddModal from 'sections/facilities/PaymentAddModal'
import PaymentTable from 'sections/facilities/PaymentTable'
import ProductTable from 'sections/facilities/ProductTable'
import { GetDetail, GetOrderDetail } from 'services/ordersServices'
import { formatDate, stringToDate } from 'utils/custom/dateHelpers'

export default function WorkForm() {
    const [data, setData] = useState([])
    const [ordersDetails, setOrdersDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const params = useParams();

    const componentRef = useRef(null)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const navigate = useNavigate()
    const [paymentModal, setPaymentModal] = useState(false)
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${params?.id}` }, { title: "İş Formu" }]

    useEffect(() => {
        setOrdersDetails([])
        GetDetail(params?.id).then((res) => {
            setLoading(false)
            if (res?.data) {
                setData(res?.data)
                res?.data?.orderDetails?.map((item) => {
                    GetOrderDetail(item?.id).then((res) => {
                        setOrdersDetails((prevValues) => [...prevValues, res?.data])
                    })
                })
            } else {
                navigate('/404')
            }

        })
    }, [])

    useEffect(() => {
        console.log(ordersDetails);
    }, [ordersDetails])


    if (loading) return <Loader open={loading} />

    return (
        <>
            <PaymentAddModal setIsEdit={setIsEdit} id={params?.id} open={paymentModal} modalToggler={setPaymentModal} />
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
                                <h2 style={{ textAlign: 'end', color: '#3f4254' }}>{data?.customer?.firstName} {data?.customer?.lastName}</h2>
                                <h1 style={{ textAlign: 'start', color: '#3f4254' }}>İŞ FORMU</h1>
                            </div>

                            <h3 style={{ textAlign: 'end', color: '#181c32', margin: 0 }}>Sipariş No : #{data?.orderNumber}</h3>
                            <h3 style={{ textAlign: 'end', color: '#181c32', marginTop: '8px' }}>Sipariş Tarihi : {formatDate(stringToDate(data?.createdAt))}</h3>
                            <Divider sx={{ marginTop: 6 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Personel</h4>
                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>{data?.user?.name} {data?.user?.surname}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Sipariş No</h4>
                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>#{data?.orderNumber}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Sipariş Tarihi</h4>
                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>{formatDate(stringToDate(data?.createdAt))}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Termin Tarihi</h4>
                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>{formatDate(stringToDate(data?.deadline))}</p>
                                </div>
                            </div>
                            <h4 style={{ color: '#a1a5b7', fontWeight: '', marginTop: 30 }}>Ürünler</h4>
                            <Divider sx={{ marginTop: 0 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <div style={{ marginTop: '25px' }}>
                                {
                                    ordersDetails?.map((item, i) => {
                                        return (
                                            <div style={{ marginBottom: '36px' }} key={i}>
                                                <table style={{ width: '100%', borderSpacing: 0, border: '1px solid black' }}>
                                                    <thead style={{ width: '100%', textAlign: 'start', borderSpacing: 0 }}>
                                                        <tr style={{ borderSpacing: 0 }}>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Adet</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Model</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Ölçü</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Kumaş-Renk</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İskelet-Renk</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ width: '100%', textAlign: 'start' }}>
                                                        <tr>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>{item?.qty}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.product?.name}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>
                                                                <div>En: {item?.width} mm</div>
                                                                <div>Boy: {item?.height} mm</div>
                                                            </td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.fabricChart?.name}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.skeletonChart?.name}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{ width: '100%', borderSpacing: 0, borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black' }}>
                                                    <thead style={{ width: '100%', textAlign: 'start', borderSpacing: 0 }}>
                                                        <tr style={{ borderSpacing: 0 }}>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Ayak</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Saçak, Baskı, Cırt</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Sipariş Notu</th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col"></th>
                                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ width: '100%', textAlign: 'start' }}>
                                                        <tr>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>{item?.standType === 1 ? "Ayaksız" : item?.standType === 2 ? "Mermer" : item?.standType === 3 ? "Flanş" : item?.standType === 4 ? "Beton" : item?.standType === 6 ? "Bidon" : item?.standType === 7 ? "Yere Montaj" : item?.standType === 8 ? "Mermere Montaj" : item?.standType === 9 ? "Özel" : ""}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.fringe === 1 ? "Yok" : "Var"}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}>{item?.orderDetailNote === null ? "" : item?.orderDetailNote}</td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}></td>
                                                            <td style={{ textAlign: 'start', borderLeft: '1px solid black', padding: '8px' }}></td>
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
