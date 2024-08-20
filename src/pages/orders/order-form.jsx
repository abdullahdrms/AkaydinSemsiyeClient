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

export default function OrderForm() {
    const [data, setData] = useState([])
    const [ordersDetails, setOrdersDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const params = useParams();

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    let totalPrice = 0
    let totalTaxPrice = 0
    // let totalPayment = 0
    const [totalPayment, setTotalPayment] = useState(0)

    const navigate = useNavigate()
    const [paymentModal, setPaymentModal] = useState(false)
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${params?.id}` }, { title: "Sipariş Formu" }]

    useEffect(() => {
        setOrdersDetails([])
        setTotalPayment(0)
        GetDetail(params?.id).then((res) => {
            setLoading(false)
            res?.data?.payments?.map((payment) => {
                // totalPayment = totalPayment + payment?.amount
                setTotalPayment((prevValue) => parseInt(prevValue) + payment?.amount)
            })
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


    if (loading) return <Loader open={loading} />

    return (
        <>
            <PaymentAddModal setIsEdit={setIsEdit} id={params?.id} open={paymentModal} modalToggler={setPaymentModal} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumbs custom links={breadcrumbLinks} />
                <Button onClick={() => handlePrint()} sx={{ height: '36px', borderRadius: 1, pl: 3, pr: 3 }} size='small' variant="contained">Siparişi Yazdır</Button>
            </div>

            <Grid marginTop={4} item xs={12}>
                <Grid container spacing={4.5}>
                    <Grid item xs={12} lg={12}>
                        <Box ref={componentRef} sx={{ bgcolor: 'white', p: 6, borderRadius: 1, height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ maxWidth: '150px', marginBottom: '16px' }}>
                                        <a href='/'>
                                            <img width="100%" src="/img/akaydin-logo.png" alt="" />
                                        </a>
                                    </div>
                                    <span style={{ color: '#181c32', fontSize: '12.35px', fontWeight: '500' }}>
                                        AKAYDIN ŞEMSİYE BRANDA SAN. ve TİC. LDT. ŞTİ. <br />
                                        GÜNGÖREN MAH. YAPIT SOK NO:24 ÇEKMEKÖY/İSTANBUL <br />
                                        0216 429 84 97 <br />
                                        SARIGAZİ VD. 014 039 9709
                                    </span>
                                </div>
                                <div>
                                    <h1 style={{ textAlign: 'start', color: '#3f4254' }}>SİPARİŞ FORMU</h1>
                                    <h3 style={{ textAlign: 'end', color: '#181c32', margin: 0 }}>Sipariş No : #{data?.orderNumber}</h3>
                                    <h3 style={{ textAlign: 'end', color: '#181c32', marginTop: '8px' }}>Sipariş Tarihi : {formatDate(stringToDate(data?.createdAt))}</h3>
                                </div>
                            </div>

                            <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '65px', fontSize: '18px' }}>{data?.customer?.firstName} {data?.customer?.lastName}</p>
                            <p style={{ color: '#181c32', fontWeight: 'bold', fontSize: '14px' }}>Telefon : {data?.customer?.phone}</p>
                            <p style={{ color: '#181c32', fontWeight: 'bold', fontSize: '14px' }}>Adres : {data?.customerAddress?.title}</p>

                            <Divider sx={{ marginTop: 6 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Personel</h4>
                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>{data?.user?.name} {data?.user?.surname}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Teslim Yeri</h4>
                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>{data?.deliveryType === 1 ? "Adres" : "Depo"}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#a1a5b7', fontWeight: '', marginBottom: 0 }}>Teslim Türü</h4>

                                    <p style={{ color: '#181c32', fontWeight: 'bold', marginTop: '5px', fontSize: '15px' }}>{data?.deliveryLocation === 1 ? "Kargo" : "Servis"}</p>
                                </div>
                            </div>
                            <div style={{ marginTop: '25px' }}>
                                <div style={{ marginBottom: '36px' }}>
                                    <table style={{ width: '100%', borderSpacing: 0 }}>
                                        <thead style={{ width: '100%', textAlign: 'start', borderSpacing: 0 }}>
                                            <tr style={{ borderSpacing: 0 }}>
                                                <th style={{ width: '500px', textAlign: 'start', padding: '8px', borderBottom: '1px solid #eff2f5' }} scope="col">Ürün</th>
                                                <th style={{ width: '200px', textAlign: 'start', padding: '8px', borderBottom: '1px solid #eff2f5' }} scope="col">Ürün Sipariş No</th>
                                                <th style={{ width: '200px', textAlign: 'start', padding: '8px', borderBottom: '1px solid #eff2f5' }} scope="col">Adet</th>
                                                <th style={{ width: '200px', textAlign: 'start', padding: '8px', borderBottom: '1px solid #eff2f5' }} scope="col">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ width: '100%', textAlign: 'start' }}>
                                            {
                                                ordersDetails?.map((item, i) => {
                                                    totalPrice = totalPrice + (item?.qty * item?.price)
                                                    totalTaxPrice = totalTaxPrice + (((item?.price * item?.qty) * item?.tax) / 100)
                                                    return (
                                                        <tr key={i}>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ display: 'flex', marginRight: '25px' }}>
                                                                        <img style={{ objectFit: 'contain' }} width={"50px"} src={`/img/products/${item?.product?.icon}`} alt="" />
                                                                    </div>
                                                                    <div>
                                                                        <p style={{ fontWeight: 'bold', lineHeight: '14px' }}>{item?.product?.name}</p>
                                                                        <p style={{ lineHeight: '14px' }}>Ölçü: (En : {item?.width} mm) Ölçü: (Boy : {item?.height} mm)</p>
                                                                        <p style={{ lineHeight: '14px' }}>Kumaş: {item?.fabricChart?.name}</p>
                                                                        <p style={{ lineHeight: '14px' }}>İskelet: {item?.skeletonChart?.name}</p>
                                                                        <p style={{ lineHeight: '14px' }}>Ayak: {item?.standType === 1 ? "Ayaksız" : item?.standType === 2 ? "Mermer" : item?.standType === 3 ? "Flanş" : item?.standType === 4 ? "Beton" : item?.standType === 6 ? "Bidon" : item?.standType === 7 ? "Yere Montaj" : item?.standType === 8 ? "Mermere Montaj" : item?.standType === 9 ? "Özel" : ""}</p>
                                                                        <p style={{ lineHeight: '14px' }}>Saçak: {item?.fringe === 1 ? "Yok" : "Var"}</p>
                                                                    </div>
                                                                </div>

                                                            </td>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>-</td>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>{item?.qty}</td>
                                                            <td style={{ textAlign: 'start', padding: '8px' }}>{(item?.qty * item?.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>
                                                </td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}></td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>TOPLAM</td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                            </tr>
                                            <tr >
                                                <td style={{ textAlign: 'start', padding: '8px' }}>
                                                </td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}></td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>KDV</td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>{totalTaxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                            </tr>
                                            <tr >
                                                <td style={{ textAlign: 'start', padding: '8px' }}>
                                                </td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}></td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>GENEL TOPLAM</td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>{(totalPrice + totalTaxPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                            </tr>
                                            <tr >
                                                <td style={{ textAlign: 'start', padding: '8px' }}>
                                                </td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}></td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>ALINAN</td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}>{totalPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                            </tr>
                                            <tr >
                                                <td style={{ textAlign: 'start', padding: '8px' }}>
                                                </td>
                                                <td style={{ textAlign: 'start', padding: '8px' }}></td>
                                                <td style={{ textAlign: 'start', padding: '8px', fontWeight: 'bold', fontSize: '18px' }}>KALAN TUTAR</td>
                                                <td style={{ textAlign: 'start', padding: '8px', fontWeight: 'bold', fontSize: '18px' }}>{((totalPrice + totalTaxPrice) - parseInt(totalPayment)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") } TL</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
