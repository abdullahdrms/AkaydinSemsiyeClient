import { useEffect, useState } from 'react';

// material ui
import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, Autocomplete, DialogContent, DialogActions, FormControl, RadioGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useLocation, useNavigate, useParams } from 'react-router';

// assets
import 'react-quill/dist/quill.snow.css';
import MainCard from 'components/MainCard';
import { CreateSparePartsService, GetOrderDetail, UpdateSparePartsService } from 'services/ordersServices';
import { openSnackbar } from 'api/snackbar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// CONSTANT
const getInitialValues = ({ update, data }) => {
    const newOrder = {
        orderNote: '',
        qty: 0,
        tax: 0,
        taxType: "",
        price: 0,
        process: 0,
        orderDetailStatus: 0
    };
    const updateOrder = {
        orderNote: `${data?.orderDetailNote === null ? "" : data?.orderDetailNote}` || "",
        qty: `${data?.qty}` || "",
        tax: 0,
        taxType: `${data?.tax === 0 ? "3" : data?.tax === 20 ? "4" : data?.tax === 10 ? "5" : ""}` || "",
        price: `${data?.price}` || "",
        process: `${data?.process}` || "",
        orderDetailStatus: `${data?.orderDetailStatus}` || 0,
    };
    if (update) {
        return updateOrder
    } else {
        return newOrder;
    }
};

export default function SparePartsProduct({ update = false }) {
    const params = useParams()
    const location = useLocation()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [data, setData] = useState([])

    const orderId = location.pathname.replace('/orders/detail/create-product/', '').split('/')[0]
    const updateOrderId = location.pathname.replace('/orders/detail/update-product/', '').split('/')[0]

    useEffect(() => {
        const fetchData = async () => {
            if (update) {
                await GetOrderDetail(updateOrderId).then((res) => {
                    console.log(res);
                    setData(res?.data)
                    setLoading(false);
                })
            } else {
                setLoading(false);
            }
        }
        fetchData()
    }, []);

    const VillaSchema = Yup.object().shape({
        taxType: Yup.string().required("bu alan zorunlu"),
        process: Yup.number().moreThan(0, "bu alan zorunlu"),
        qty: Yup.number().moreThan(0, "Bu alan zorunlu ve 0 dan büyük olmalı"),
        price: Yup.number().moreThan(0, "Bu alan zorunlu ve 0 dan büyük olmalı")
    });

    const formik = useFormik({
        initialValues: getInitialValues({ data: data, update: update }),
        validationSchema: VillaSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true)

                const fd = new FormData()
                if (update) {
                    fd.append("Id", updateOrderId)
                    fd.append("OrderDetailStatus", parseInt(formik.values.orderDetailStatus))
                } else {
                    fd.append("OrderId", orderId)
                    fd.append("OrderDetailStatus", 1)
                }
                fd.append("ProductId", 6)
                fd.append("OrderDetailNote", formik.values.orderNote)

                fd.append("Qty", formik.values.qty)
                fd.append("TaxType", formik.values.taxType)
                fd.append("Price", formik.values.price)
                fd.append("Process", formik.values.process)

                if (update) {
                    await UpdateSparePartsService(fd).then((res) => {
                        if (res?.errors || res?.statusCode === 400 || res?.statusCode === 500) {
                            openSnackbar({
                                open: true,
                                message: `${res?.message ? res?.message : 'Error'}`,
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        } else {
                            navigate(`/orders/detail/product-detail/${updateOrderId}`)
                        }
                        setSubmitting(false)
                    })
                } else {
                    await CreateSparePartsService(fd).then((res) => {
                        if (res?.errors || res?.statusCode === 400 || res?.statusCode === 500) {
                            openSnackbar({
                                open: true,
                                message: `${res?.message ? res?.message : 'Error'}`,
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        } else {
                            navigate(`/orders/detail/${orderId}`)
                        }
                        setSubmitting(false)
                    })
                }
            } catch (error) {
                // console.error(error);
            }
        }
    });

    const processList = [
        {
            text: 'Kumaş Değişimi',
            value: 1,
        },
        {
            text: 'Kumaş Tamiri',
            value: 2,
        },
        {
            text: 'İskelet Tamiri',
            value: 3,
        },
        {
            text: 'Yedek Parça Siparişi',
            value: 5,
        },
        {
            text: 'Şemsiye Ayağı Siparişi',
            value: 6,
        },
        {
            text: 'Özel',
            value: 7,
        },
        {
            text: 'Servis Hizmeti',
            value: 8,
        },
    ]

    const statusTypes = [
        {
            name: "Ürün Başladı",
            id: 1
        },
        {
            name: "Kumaş Hazır",
            id: 2
        },
        {
            name: "İskelet Hazır",
            id: 3
        },
        {
            name: "Ürün Hazır",
            id: 4
        }
    ]


    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${data?.orderId}` }, { title: 'Ürün Detayı', to: `/orders/detail/product-detail/${updateOrderId}` }, { title: 'Ürün Düzenle' }, { title: 'Yedek Parça ve Servis', }]

    if (loading)
        return (
            <Box sx={{ p: 5 }}>
                <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                </Stack>
            </Box>
        );

    return (
        <>
            {
                update &&
                <Breadcrumbs custom links={breadcrumbLinks} />
            }
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>

                                {
                                    update &&
                                    <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                        <MainCard title='Sipariş Durumu'>
                                            <Grid item marginBottom={3} xs={12}>
                                                {/* <InputLabel sx={{ marginBottom: 2 }}>Müşteri Seçimi</InputLabel> */}
                                                <Autocomplete
                                                    disableClearable
                                                    fullWidth
                                                    id="basic-autocomplete-label"
                                                    options={statusTypes}
                                                    getOptionLabel={(option) => `${option?.name}` || ''}
                                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                    onChange={(e, value) => { setFieldValue('orderDetailStatus', value?.id) }}
                                                    value={statusTypes.find((item) => parseInt(item?.id) === parseInt(formik.values.orderDetailStatus)) || null}
                                                    renderInput={(params) => <TextField {...params} helperText={errors.orderDetailStatus} error={Boolean(errors.orderDetailStatus)} label="Lütfen Sipariş Durumu Seçiniz" />}
                                                />
                                            </Grid>
                                        </MainCard>
                                    </Grid>
                                }

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Yapılan İşlem'>
                                        <Grid item marginBottom={3} xs={12} lg={8}>
                                            <Autocomplete
                                                fullWidth
                                                id="process"
                                                disableClearable
                                                options={processList}
                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                onChange={(e, value) => setFieldValue('process', parseInt(value?.value))}
                                                getOptionLabel={(option) => `${option?.text ? option?.text : ''}` || ''}
                                                value={processList.find((item) => parseInt(item?.value) === parseInt(formik.values.process)) || null}
                                                renderInput={(params) => <TextField helperText={errors.process} error={Boolean(errors.process)} {...params} label="Lütfen İşlem Seçiniz" />}
                                            />
                                        </Grid>
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Sipariş Adeti'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <div style={{ marginLeft: '2px', marginBottom: '10px' }}>
                                            </div>
                                            <TextField
                                                fullWidth
                                                id="qty"
                                                type='number'
                                                placeholder="Sipariş Adeti Giriniz"
                                                {...getFieldProps('qty')}
                                                error={Boolean(errors.qty)}
                                                helperText={errors.qty}
                                            />
                                        </Grid>
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Sipariş Tutarı'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <div style={{ marginLeft: '2px', marginBottom: '10px' }}>
                                            </div>
                                            <TextField
                                                fullWidth
                                                id="price"
                                                type='number'
                                                placeholder="Sipariş Tutarı Giriniz"
                                                {...getFieldProps('price')}
                                                error={Boolean(errors.price)}
                                                helperText={errors.price}
                                            />
                                        </Grid>
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Kdv Oranı Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}></InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='taxType' name="radio-taxType" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('taxType', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.taxType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.taxType === "4" ? true : false} onChange={(e) => setFieldValue('taxType', "4")} name='radio-taxType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        %20
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('taxType', "5")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.taxType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="5" checked={formik.values.taxType === "5" ? true : false} onChange={(e) => setFieldValue('taxType', "5")} name='radio-taxType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        %10
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('taxType', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.taxType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.taxType === "3" ? true : false} onChange={(e) => setFieldValue('taxType', "3")} name='radio-taxType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        %0
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.taxType &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>
                                    </MainCard>
                                </Grid>

                                <Grid item xs={12}>
                                    <MainCard title='Ürün Notları'>
                                        <Grid item xs={12}>
                                            <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                                            <TextField
                                                fullWidth
                                                id="orderNote"
                                                multiline
                                                rows={5}
                                                placeholder="Ürün Notları"
                                                {...getFieldProps('orderNote')}
                                                error={Boolean(touched.orderNote && errors.orderNote)}
                                                helperText={touched.orderNote && errors.orderNote}
                                            />
                                        </Grid>
                                    </MainCard>
                                </Grid>

                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="end">
                                <Grid item>
                                    <Stack direction="row" spacing={2} alignItems="end">
                                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                                            KAYDET
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}