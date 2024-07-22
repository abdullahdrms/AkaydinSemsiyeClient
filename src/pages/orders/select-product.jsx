import React, { useState } from 'react'
import { Box, Button, Chip, Divider, Grid, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import { useNavigate, useParams } from 'react-router'
import { useEffect } from 'react'
import { GetAllProducts } from 'services/productsServices'
import Loader from 'components/Loader'

export default function SelectProduct() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const params = useParams();
    const [data, setData] = useState([])
    useEffect(() => {
        GetAllProducts().then((res) => {
            setData(res?.data)
            setLoading(false)
        })
    }, [])
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${params.id}` }, { title: 'Ürün Ekle' }]

    if (loading) return <Loader open={loading} />

    return (
        <>
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid marginTop={4} item xs={12}>
                <Grid container spacing={4.5}>
                    <Grid item xs={12}>
                        <Box sx={{ bgcolor: 'white', p: 7, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="span" >
                                Ürün Seçimi
                            </Typography>
                            <Typography sx={{ marginTop: 1, marginBottom: 6 }} color='#7e8299' variant="subtitle1">
                                <Typography color='#7e8299' variant="subtitle1" component="span" fontSize={14}>
                                    Lütfen siparişe eklemek istediğiniz ürün seçimini yapınız.
                                </Typography>
                            </Typography>
                            <Grid container spacing={4}>
                                {
                                    data?.map((item, i) => {
                                        return (
                                            <Grid key={i} item xs={12} lg={6}>
                                                <Box height='100%' onClick={() => navigate(`/orders/detail/create-product/${params.id}/${item?.id}`)} sx={{ p: 2.5, pl: 2.5, cursor: 'pointer', borderRadius: 1, border: '1px dashed #e4e6ef', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                                                            <img style={{ objectFit: 'contain' }} height={26} width={35} src={`/img/products/${item?.icon}`} alt="" />
                                                        </div>
                                                        <div>
                                                            <Typography marginBottom={1} variant="h5" >
                                                                {item?.name}
                                                            </Typography>
                                                            <Typography color='#7e8299' variant="subtitle1" component="span" fontSize={14}>
                                                                {item?.description}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
