import { Box, Button, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import Loader from 'components/Loader'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PaymentAddModal from 'sections/facilities/PaymentAddModal'
import UmbrellaModalDelete from 'sections/facilities/UmbrellaModalDelete'
import { GetOrderDetail } from 'services/ordersServices'
import { formatDate, stringToDate } from 'utils/custom/dateHelpers'

export default function ProductDetail() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const [umbrellaDeleteModal, setUmbrellaDeleteModal] = useState(false)
    const params = useParams();
    const navigate = useNavigate()
    const [paymentModal, setPaymentModal] = useState(false)
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${data?.orderId}` }, { title: "Ürün Detayı" }]

    useEffect(() => {
        GetOrderDetail(params?.id).then((res) => {
            if (res?.data) {
                setData(res?.data)
            } else {
                navigate('/404')
            }
            setLoading(false)
        })
    }, [])

    if (loading) return <Loader open={loading} />

    const handleClose = () => {
        setUmbrellaDeleteModal(false)
    }

    return (
        <>
            <PaymentAddModal setIsEdit={setIsEdit} id={params?.id} open={paymentModal} modalToggler={setPaymentModal} />
            <UmbrellaModalDelete title={data?.product?.name} id={params?.id} orderId={data?.orderId} handleClose={handleClose} open={umbrellaDeleteModal} />
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid marginTop={4} item xs={12}>
                <Grid marginBottom={5} gap={1.6} display={'flex'} justifyContent={'end'} item xs={12}>
                    <Button onClick={() => navigate(`/orders/detail/update-product/${params.id}/${data?.product?.name === "Kamelya" ? 1 : data?.product?.name === "Mekanizmalı Lüks Şemsiye" ? 2 : data?.product?.name === "Mekanizmalı Ekonomik Şemsiye" ? 3 : data?.product?.name === "Yandan Gövdeli Şemsiye" ? 4 : data?.product?.name === "Klasik Şemsiye" ? 5 : data?.product?.name === "Yedek Parça ve Servis" ? 6 : data?.product?.name === "Ahşap Şemsiye" ? 7 : data?.product?.name === "Plaj Şemsiyesi" ? 8 : ""}`)} color='warning' variant="contained">Siparişi Düzenle</Button>
                    <Button onClick={() => setUmbrellaDeleteModal(true)} color='error' variant="contained">Sil</Button>
                </Grid>
                <Grid container spacing={4.5}>
                    <Grid item xs={12} lg={6}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="h4">
                                Sipariş Bilgileri
                            </Typography>
                            <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 150 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş No
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    #111
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 150 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Durumu
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    <Chip sx={{ borderRadius: 1, position: 'relative', top: '-2px' }} size="small" label={data?.orderDetailStatus === 1 ? 'Oluşturuldu' : data?.orderDetailStatus === 2 ? 'Başladı' : data?.orderDetailStatus === 3 ? 'Kısmi Hazır' : ''} variant="outlined" color={data?.orderDetailStatus === 1 ? 'success' : data?.orderDetailStatus === 2 ? 'success' : data?.orderDetailStatus === 3 ? 'warning' : 'error'} />
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Ürün Bilgisi
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {data?.product?.name}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Tarihi
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {formatDate(stringToDate(data?.createdAt))}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Adet
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {data?.qty}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Notları {"=>"} {" "}
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {data?.orderDetailNote}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="h4">
                                Fiyat Bilgileri
                            </Typography>
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Fiyat
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {data?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Sipariş Toplam Fiyat
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {(data?.price * data?.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Kdv (%{data?.tax})
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {(((data?.price * data?.qty) * data?.tax) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Genel Toplam
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                    {((((data?.price * data?.qty) * data?.tax) / 100) + (data?.price * data?.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    {
                        data?.shape !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Şekil ve Ölçü Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Şekil
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.shape === 1 ? "Kare" : data?.shape === 2 ? "Dikdörtgen" : data?.shape === 3 ? "Yuvarlak" : data?.shape === 4 ? "Özel" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.diameter === 0 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                En
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.width} mm
                                            </Typography>
                                        </Typography>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Boy
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.height} mm
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.diameter > 0 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Çap
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.diameter} mm
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Baca Bilgileri
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.flue === 1 ? "Yok" : data?.flue === 2 ? "Bacalı" : data?.flue === 3 ? "Havalandırmalı" : ""}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Grid>
                    }
                    {
                        data?.skeletonChart &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Gövde ve İskelet Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        İskelet Renk Bilgileri
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.skeletonChart?.name}
                                    </Typography>
                                </Typography>
                                <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                <Box component="section" sx={{ width: '100%', marginTop: '30px', height: '258px', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                    <img width="100%" height="100%" src={`/img/skeleton/${data?.skeletonChart?.code}.jpg`} alt="" />
                                </Box>
                            </Box>
                        </Grid>
                    }
                    {
                        data?.fabric !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Kumaş Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Kumaş
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.fabric === 1 ? "Akrilik" : data?.fabric === 2 ? "Lokal" : data?.fabric === 3 ? "Özel" : data?.fabric === 4 ? "Makrome" : ""}
                                    </Typography>
                                </Typography>
                                <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                {
                                    data?.fabric !== 3 &&
                                    <>
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Kumaş Renk Kodu
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.fabricChart?.name}
                                            </Typography>
                                        </Typography>
                                        <Box component="section" sx={{ width: '100%', marginTop: '30px', height: '258px', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                            <img style={{objectFit: 'contain'}} width="100%" height="100%" src={`/img/${data?.fabricChart?.colorType === 1 ? "acrylic" : "local"}/${data?.fabricChart?.colorType === 1 ? "acrilla" : "local"}-${data?.fabricChart?.code}.jpg`} alt="" />
                                        </Box>
                                    </>
                                }
                                {
                                    data?.fabric === 3 &&
                                    <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                        <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                            Kumaş Notları {"=>"} {"  "}
                                        </Typography>
                                        <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                            {data?.fabricText}
                                        </Typography>
                                    </Typography>
                                }
                            </Box>
                        </Grid>
                    }
                    {
                        data?.standType !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Ayak Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Ayak
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.standType === 1 ? "Ayaksız" : data?.standType === 2 ? "Mermer" : data?.standType === 3 ? "Flanş" : data?.standType === 4 ? "Beton" : data?.standType === 6 ? "Bidon" : data?.standType === 7 ? "Yere Montaj" : data?.standType === 8 ? "MermereMontaj" : data?.standType === 9 ? "Özel" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.standType === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Mermer
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.marbleStatus === 1 ? "Yok" : "Var"}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.marbleStatus === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Mermer Türü
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.marbleType === 1 ? "Mermerli_4_85_85" : data?.marbleType === 2 ? "Mermerli_4_70_70" : data?.marbleType === 3 ? "Mermerli_8_85_85" : data?.marbleType === 4 ? "Mermerli_8_70_70" : data?.marbleType === 5 ? "DonerTekerlekli_4_Mermerli" : data?.marbleType === 6 ? "Mermerli_4_100_100" : data?.marbleType === 7 ? "Mermerli_8_100_100" : ""}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.standType === 3 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Flanş Türü
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.flansType === 1 ? "Flanş 25x25" : data?.flansType === 2 ? "Flanş 35x35" : ""}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.standType === 9 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Ayak Notları {"=>"} {"  "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.standText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }

                            </Box>
                        </Grid>
                    }
                    {
                        data?.fringe !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Saçak Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Saçak
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.fringe === 1 ? "Yok" : data?.fringe === 2 ? "Var" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.fringe === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Baskı
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.print === 1 ? "Yok" : data?.print === 2 ? "Var" : ""}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.print === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Baskı Köşe Sayısı
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.printCornerCount}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    (data?.printText && data?.print === 2) &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Baskı Notları {"=>"} {"  "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.printText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.fringe === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Cırt
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.velcro === 1 ? "Yok" : data?.velcro === 2 ? "Var" : ""}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.velcro === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Cırt Köşe Sayısı
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.velcroCornerCount}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    (data?.velcro === 2 && data?.velcroText) &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Cırt Notları {"=>"} {" "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.velcroText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }

                                {
                                    (data?.fringe === 2 && data?.biasText) &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Saçak Renk Notları {"=>"} {" "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.biasText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Saçak Renk Notları {"=>"} {" "}
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.biasText}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Grid>
                    }
                    {
                        data?.led !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Led Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Led
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.led === 1 ? "Yok" : data?.led === 2 ? "Var" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.led === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Led Adet
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.ledQty}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.led === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Led Türü
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.ledType === 1 ? "Adaptörlü 12 Volt" : data?.ledType === 2 ? "Güneş Enerjili" : data?.ledType === 3 ? "Özel" : ""}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    (data?.led === 2 && data?.ledType === 3) &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Led Notları {"=>"} {" "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.ledText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                            </Box>
                        </Grid>
                    }
                    {
                        data?.electric !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Elektrik Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Elektrik
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.electric === 1 ? "Yok" : data?.electric === 2 ? "Var" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.electric === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Elektrik Notları {"=>"} {" "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.electricText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                            </Box>
                        </Grid>
                    }
                    {
                        data?.heater !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Isıtıcı Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Isıtıcı
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.heater === 1 ? "Yok" : data?.heater === 2 ? "Var" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.heater === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Isıtıcı Adet
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.heaterQty}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    (data?.heater === 2 && data?.heaterText === 3) &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Isıtıcı Notları {"=>"} {" "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.heaterText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                            </Box>
                        </Grid>
                    }
                    {
                        data?.engine !== 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    Motor Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        Motor
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.engine === 1 ? "Yok" : data?.engine === 2 ? "Var" : ""}
                                    </Typography>
                                </Typography>
                                {
                                    data?.engine === 2 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Motor Türü
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.engineType === 1 ? "Güneş Enerjili" : data?.engineType === 2 ? "Şebeke Enerjili" : data?.engineType === 3 ? "Özel" : ""}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                                {
                                    data?.engineType === 3 &&
                                    <>
                                        <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                                        <Typography sx={{ marginTop: 2.5, display: 'block', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                            <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                                Motor Notları {"=>"} {" "}
                                            </Typography>
                                            <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                                {data?.engineText}
                                            </Typography>
                                        </Typography>
                                    </>
                                }
                            </Box>
                        </Grid>
                    }
                    {
                        data?.process > 0 &&
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                                <Typography variant="h4" component="h4">
                                    İşlem Bilgileri
                                </Typography>
                                <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                    <Typography color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                        İşlem
                                    </Typography>
                                    <Typography sx={{ textAlign: 'end' }} color='black' variant="subtitle1" fontSize={15} component="span">
                                        {data?.process === 1 ? "Kumaş Değişimi" : data?.process === 2 ? "Kumaş Tamiri" : data?.process === 3 ? "İskelet Tamiri" : data?.process === 4 ? "Plaj Şemsiye Siparişi" : data?.process === 5 ? "Yedek Parça Siparişi" : data?.process === 6 ? "Şemsiye Ayağı Siparişi" : data?.process === 7 ? "Özel" : data?.process === 8 ? "Servis Hizmeti" : ""}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </>
    )
}
