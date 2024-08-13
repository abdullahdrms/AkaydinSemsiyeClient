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
import { getFabricCharts } from 'services/fabricChartsServices';
import { CreateBeachUmbrella, GetOrderDetail, UpdateBeachUmbrella } from 'services/ordersServices';
import { openSnackbar } from 'api/snackbar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// CONSTANT
const getInitialValues = ({ update, data }) => {
    const newOrder = {
        orderNote: "",
        qty: 0,
        taxType: "",
        price: 0,
        fabric: "",
        fabricText: "",
        standType: "",
        velcroText: "",
        biasText: "",
        localColor: 0,
        fabricChartId: 0,
        orderDetailStatus: 0
    };
    const orderUpdate = {
        orderNote: `${data?.orderDetailNote === null ? "" : data?.orderDetailNote}`,
        qty: `${data?.qty}` || "",
        taxType: `${data?.tax === 0 ? "3" : data?.tax === 20 ? "4" : data?.tax === 10 ? "5" : ""}` || "",
        price: `${data?.price}` || "",
        fabric: `${data?.fabric}` || "",
        fabricText: `${data?.fabricText === null ? "" : data?.fabricText}`,
        standType: `${data?.standType}` || "",
        velcroText: `${data?.velcroText === null ? "" : data?.velcroText}`,
        biasText: `${data?.biasText === null ? "" : data?.biasText}`,
        localColor: `${data?.fabricChart?.colorType === 2 ? data?.fabricChart?.code : 0}` || "",
        orderDetailStatus: `${data?.orderDetailStatus}` || 0,
    };
    if (update) {
        return orderUpdate
    } else {
        return newOrder;
    }
};

export default function BeachProduct({ update = false }) {
    const params = useParams()
    const location = useLocation()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [data, setData] = useState([])

    const [localColors, setLocalColors] = useState([])

    const orderId = location.pathname.replace('/orders/detail/create-product/', '').split('/')[0]
    const updateOrderId = location.pathname.replace('/orders/detail/update-product/', '').split('/')[0]

    useEffect(() => {
        // console.log('orderId:', orderId, 'productId:', params.id);
        const fetchData = async () => {
            if (update) {
                await GetOrderDetail(updateOrderId).then((res) => {
                    setData(res?.data)
                })
            }
            await getFabricCharts().then((res) => {
                res?.data?.map((item) => {
                    if (item?.colorType === 2) {
                        setLocalColors((prevValues) => [...prevValues, item])
                    }
                })
                setLoading(false)
            })
        }
        fetchData()
    }, []);

    const VillaSchema = Yup.object().shape({
        fabric: Yup.string().required("bu alan zorunlu"),
        fabricText: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.fabric) === 3) {
                if (formik.values.fabricText !== "") {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        standType: Yup.string().required("bu alan zorunlu"),
        qty: Yup.number().moreThan(0, "bu alan zorunlu ve 0 dan büyük olmalı"),
        price: Yup.number().moreThan(0, "bu alan zorunlu ve 0 dan büyük olmalı"),
        taxType: Yup.string().required("bu alan zorunlu"),
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
                } else {
                    fd.append("OrderId", orderId)
                }
                fd.append("ProductId", 8)
                fd.append("OrderDetailNote", formik.values.orderNote)
                if (update) {
                    fd.append("OrderDetailStatus", parseInt(formik.values.orderDetailStatus))
                } else {
                    fd.append("OrderDetailStatus", 1)
                }
                fd.append("Qty", formik.values.qty)
                fd.append("TaxType", formik.values.taxType)
                fd.append("Price", formik.values.price)
                fd.append("Fabric", formik.values.fabric)
                if (parseInt(formik.values.fabric) === 3) {
                    fd.append("FabricText", formik.values.fabricText)
                }
                if (parseInt(formik.values.fabric) === 2) {
                    fd.append("FabricChartId", formik.values.fabricChartId)
                }
                fd.append("StandType", formik.values.standType)
                if (parseInt(formik.values.fabric) === 2) {
                    fd.append("LocalFabricChartCode", formik.values.localColor)
                }

                if (update) {
                    await UpdateBeachUmbrella(fd).then((res) => {
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
                    await CreateBeachUmbrella(fd).then((res) => {
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

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${data?.orderId}` }, { title: 'Ürün Detayı', to: `/orders/detail/product-detail/${updateOrderId}` }, { title: 'Ürün Düzenle' }, { title: 'Plaj Şemsiyesi', }]

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
                                                    getOptionLabel={(option) => `${option?.name}`}
                                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                    onChange={(e, value) => { setFieldValue('orderDetailStatus', value?.id) }}
                                                    value={statusTypes.find((item) => parseInt(item?.id) === parseInt(formik.values.orderDetailStatus))}
                                                    renderInput={(params) => <TextField {...params} helperText={errors.orderDetailStatus} error={Boolean(errors.orderDetailStatus)} label="Lütfen Sipariş Durumu Seçiniz" />}
                                                />
                                            </Grid>
                                        </MainCard>
                                    </Grid>
                                }
                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Kumaş Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Kumaş</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='fabric' name="radio-fabric" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('fabric', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.fabric ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.fabric === "2" ? true : false} onChange={(e) => setFieldValue('fabric', "2")} name='radio-fabric' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Yerli
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('fabric', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.fabric ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.fabric === "3" ? true : false} onChange={(e) => setFieldValue('fabric', "3")} name='radio-fabric' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Özel
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.fabric &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>
                                        {
                                            parseInt(formik.values.fabric) > 0 &&
                                            <Grid marginBottom={3} item xs={12}>
                                                <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}></InputLabel>
                                                <FormControl style={{ width: '100%' }} component="fieldset">
                                                    <RadioGroup id='shape' name="radio-shapeSizeType" row>
                                                        <Grid spacing={3} container >
                                                            {
                                                                parseInt(formik.values.fabric) === 2 &&
                                                                <>
                                                                    <Grid item marginBottom={3} xs={12} lg={8}>
                                                                        <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                            Renk
                                                                        </div>
                                                                        <Autocomplete
                                                                            fullWidth
                                                                            disableClearable
                                                                            id="basic-autocomplete-label"
                                                                            options={localColors}
                                                                            getOptionLabel={(option) => `${option.name}`}
                                                                            onChange={(e, value) => { setFieldValue('localColor', value.code); setFieldValue('fabricChartId', value.id) }}
                                                                            value={localColors?.find((item) => parseInt(item?.code) === parseInt(formik.values.localColor))}
                                                                            renderInput={(params) => <TextField error={Boolean(errors.localColor)} helperText={errors.localColor} {...params} label="Lütfen Yerli Renk Seçiniz" />}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} lg={4} >
                                                                        <Box component="section" sx={{ width: '100%', height: '258px', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <img width="100%" height="100%" src={`/img/local/local-${formik.values.localColor}.jpg`} alt="" />
                                                                        </Box>
                                                                    </Grid>
                                                                </>
                                                            }
                                                            {
                                                                parseInt(formik.values.fabric) === 3 &&
                                                                <>
                                                                    <Grid item xs={12}>
                                                                        <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                            Renk
                                                                        </div>
                                                                        <TextField
                                                                            fullWidth
                                                                            id="fabricText"
                                                                            multiline
                                                                            rows={5}
                                                                            placeholder="Kumaş Renk Seçimi Açıklaması"
                                                                            {...getFieldProps('fabricText')}
                                                                            error={Boolean(touched.fabricText && errors.fabricText)}
                                                                            helperText={touched.fabricText && errors.fabricText}
                                                                        />
                                                                    </Grid>
                                                                </>
                                                            }
                                                        </Grid>

                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        }
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Ayak Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}></InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='standType' name="radio-standType" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('standType', "6")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="6" checked={formik.values.standType === "6" ? true : false} onChange={(e) => setFieldValue('standType', "6")} name='radio-standType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Bidon
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('standType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.standType === "1" ? true : false} onChange={(e) => setFieldValue('standType', "1")} name='radio-standType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Ayaksız
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.standType &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
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
                                                error={Boolean(touched.qty && errors.qty)}
                                                helperText={touched.qty && errors.qty}
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
                                                error={Boolean(touched.price && errors.price)}
                                                helperText={touched.price && errors.price}
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