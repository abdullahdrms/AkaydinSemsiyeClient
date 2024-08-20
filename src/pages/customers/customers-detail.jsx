import { Box, Button, Divider, Grid, Link, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Loader from 'components/Loader';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import CustomerDetailOrderList from 'sections/customers/CustomerDetailOrderList'
import { GetCustomerDetail } from 'services/customersServices';

export default function CustomersDetail() {
    const navigate = useNavigate()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    let breadcrumbLinks = [{ title: 'Müşteri Yönetimi' }, { title: 'Müşteriler', to: `/customers/list` }, { title: 'Müşteri Detayları' }];

    useEffect(() => {
        GetCustomerDetail(params?.id).then((res) => {
            setLoading(false)
            setData(res?.data)
        })
    }, [])

    if (loading) return <Loader open={loading} />

    return (
        <>
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid marginBottom={5} gap={1.6} display={'flex'} justifyContent={'end'} item xs={12}>
                <Button onClick={() => navigate(`/customers/addresses/${params?.id}`)} color='primary' variant="contained">Adresler</Button>
                <Button onClick={() => navigate(`/customers/${data?.customerType === 2 ? 'business/' : ''}update/${params.id}`)} color='warning' variant="contained">Düzenle</Button>
            </Grid>
            <Grid container marginBottom={5} spacing={4.5}>
                {
                    data?.customerType === 2 &&
                    <Grid item xs={12} lg={data?.customerType === 2 ? 4 : 6}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                            <Typography variant="h4" component="h4">
                                Firma Bilgileri
                            </Typography>
                            <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Firma Adı
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {data?.companyName}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Vergi Dairesi
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {data?.taxAdmin}
                                </Typography>
                            </Typography>
                            <Divider sx={{ marginTop: 1.5 }} orientation="horizontal" variant="fullWidth" flexItem />
                            <Typography sx={{ marginTop: 2.5, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                                <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                    Vergi No
                                </Typography>
                                <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                    {data?.taxNumber}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                }
                <Grid item xs={12} lg={data?.customerType === 2 ? 4 : 6}>
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                        <Typography variant="h4" component="h4">
                            Müşteri Bilgileri
                        </Typography>
                        <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                            <Typography sx={{ width: 100 }} color='#7e8299' variant="subtitle1" fontSize={15} component="span">
                                Adı Soyadı
                            </Typography>
                            <Typography sx={{ textAlign: 'end' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                {data?.firstName} {data?.lastName}
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
                                }]} color="#7e86a6" underline='none' href={`mailto:${data?.email}`}>
                                    {data?.email}
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
                                }]} color="#7e86a6" underline='none' href={`tel:${data?.phone}`}>
                                    {data?.phone}
                                </Link>
                            </Typography>
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={data?.customerType === 2 ? 4 : 6}>
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, height: '100%' }}>
                        <Typography variant="h4" component="h4">
                            Müşteri Notu
                        </Typography>
                        <Typography sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }} color='#7e8299' variant="subtitle1" component="span">
                            <Typography sx={{ textAlign: 'start' }} color='#7e86a6' variant="subtitle1" fontSize={15} component="span">
                                {data?.customerNote}
                            </Typography>
                        </Typography>
                    </Box>
                </Grid>
            </Grid >
            <CustomerDetailOrderList data={data?.orders} />
        </>
    )
}
