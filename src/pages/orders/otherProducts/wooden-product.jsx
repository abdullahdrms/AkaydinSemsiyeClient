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
import { CreateWoodenUmbrella, GetOrderDetail, UpdateWoodenUmbrella } from 'services/ordersServices';
import { openSnackbar } from 'api/snackbar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import StockControlModal from 'sections/facilities/StockControlModal';
import { getListStockControl, restoreStock } from 'services/stockServices';
import ErrorModal from 'sections/facilities/ErrorModal';

// CONSTANT
const getInitialValues = ({ data, update }) => {
    const newOrder = {
        shape: "",
        body: "",
        orderNote: '',
        qty: 0,
        taxType: "",
        price: 0,
        shapeSizeType: "",
        flansType: "",
        fabric: "",
        fabricText: "",
        standType: "",
        standText: "",
        fringe: "",
        print: "",
        printCornerCount: "",
        printText: '',
        velcro: "",
        velcroCornerCount: "",
        velcroText: '',
        biasText: '',
        led: "",
        ledQty: 0,
        ledType: "",
        ledText: "",
        acrylicColor: 0,
        localColor: 0,
        marbleStatus: "",
        marbleType: "",
        fabricChartId: 0,
        orderDetailStatus: 0
    };
    const orderUpdate = {
        shape: `${data?.shape}` || "",
        body: `${data?.body}` || "",
        orderNote: `${data?.orderDetailNote === null ? "" : data?.orderDetailNote}` || "",
        qty: `${data?.qty}` || "",
        taxType: `${data?.tax === 0 ? "3" : data?.tax === 20 ? "4" : data?.tax === 10 ? "5" : ""}` || "",
        price: `${data?.price}` || "",
        flansType: `${data?.flansType}` || "",
        shapeSizeType: `${data?.width === 200 && data?.height === 200 ? "1" : data?.width === 250 && data?.height === 250 ? "2" : data?.width === 300 && data?.height === 300 ? "3" : data?.width === 350 && data?.height === 350 ? "4" : data?.width === 400 && data?.height === 400 ? "5" : data?.width === 450 && data?.height === 450 ? "6" : data?.width === 500 && data?.height === 500 ? "7" : data?.width === 550 && data?.height === 550 ? "8" : data?.width === 600 && data?.height === 600 ? "9" : data?.width === 300 && data?.height === 400 ? "10" : data?.width === 400 && data?.height === 500 ? "11" : data?.width === 500 && data?.height === 600 ? "12" : data?.width === 400 && data?.height === 600 ? "13" : data?.diameter === 250 ? "14" : ""}` || "",
        fabric: `${data?.fabric}` || "",
        fabricText: `${data?.fabricText === null ? "" : data?.fabricText}` || "",
        standType: `${data?.standType}` || "",
        standText: `${data?.standText === null ? "" : data?.standText}` || "",
        fringe: `${data?.fringe}` || "",
        print: `${data?.print}` || "",
        printCornerCount: `${data?.printCornerCount}` || "",
        printText: `${data?.printText === null ? "" : data?.printText}` || "",
        velcro: `${data?.velcro}` || "",
        velcroCornerCount: `${data?.velcroCornerCount}` || "",
        velcroText: `${data?.velcroText === null ? "" : data?.velcroText}` || "",
        biasText: `${data?.biasText === null ? "" : data?.biasText}` || "",
        led: `${data?.led}` || "",
        ledQty: `${data?.ledQty}` || "",
        ledType: `${data?.ledType}` || "",
        ledText: `${data?.ledText === null ? "" : data?.ledText}` || "",
        acrylicColor: `${data?.fabricChart?.colorType === 1 ? data?.fabricChart?.code : 0}` || "",
        localColor: `${data?.fabricChart?.colorType === 2 ? data?.fabricChart?.code : 0}` || "",
        fabricChartId: `${data?.fabricChart?.id}` || 0,
        marbleStatus: `${data?.marbleStatus}` || "",
        marbleType: `${data?.marbleType}` || "",
        orderDetailStatus: `${data?.orderDetailStatus}` || 0,
    };
    if (update) {
        return orderUpdate
    } else {
        return newOrder;
    }
};

export default function WoodenProduct({ update = false }) {
    const params = useParams()
    const location = useLocation()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [data, setData] = useState([])

    const [localColors, setLocalColors] = useState([])
    const [acrylicColors, setAcrylicColors] = useState([])

    const [stockModal, setStockModal] = useState(false)
    const [stockData, setStockData] = useState([])
    const [formDt, setFormDt] = useState('')

    const [errorModal, setErrorModal] = useState(false)

    const orderId = location.pathname.replace('/orders/detail/create-product/', '').split('/')[0]
    const updateOrderId = location.pathname.replace('/orders/detail/update-product/', '').split('/')[0]

    const [prevStockData, setPrevStockData] = useState({})

    useEffect(() => {
        // console.log('orderId:', orderId, 'productId:', params.id);
        const fetchData = async () => {
            if (update) {
                await GetOrderDetail(updateOrderId).then((res) => {
                    setData(res?.data)
                    setPrevStockData({
                        stockStandQty: res?.data?.stockStandQty,
                        stockFabricQty: res?.data?.stockFabricQty,
                        stockSkeletonQty: res?.data?.stockSkeletonQty
                    })
                })
            }
            await getFabricCharts().then((res) => {
                res?.data?.map((item) => {
                    if (item?.colorType === 2) {
                        setLocalColors((prevValues) => [...prevValues, item])
                    } else if (item?.colorType === 1) {
                        setAcrylicColors((prevValues) => [...prevValues, item])
                    }
                })
                setLoading(false)
            })
        }
        fetchData()
    }, []);

    const VillaSchema = Yup.object().shape({
        shape: Yup.string().required('bu alan zorunlu'),
        shapeSizeType: Yup.string().required('bu alan zorunlu'),
        skeletonChartId: Yup.number().moreThan(0, 'Bu alan zorunlu'),
        marbleStatus: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.standType) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        marbleType: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.standType) === 2) {
                if (parseInt(formik.values.marbleStatus) === 2) {
                    if (parseInt(value) > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            }
            else {
                return true
            }
        }),
        standText: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.standType) === 9) {
                if (formik.values.standText !== "") {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        fabric: Yup.string().required('bu alan zorunlu'),
        flansType: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.standType) === 3) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        acrylicColor: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.fabric) === 1) {
                if (value > 0) {
                    return true
                } else {
                    false
                }
            } else {
                return true
            }
        }),
        localColor: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.fabric) === 2) {
                if (value > 0) {
                    return true
                } else {
                    false
                }
            } else {
                return true
            }
        }),
        body: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(value) === 1 || parseInt(value) === 2) {
                return true
            } else {
                return false
            }
        }),
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
        standType: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.body) === 2) {
                if (parseInt(value) !== 6) {
                    return true
                } else {
                    return false
                }
            } else if (parseInt(value) > 0) {
                return true
            } else {
                return false
            }
        }),
        fringe: Yup.string().required('bu alan zorunlu'),
        print: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.fringe) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        printText: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.print) === 2) {
                if (formik.values.printText !== "") {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        printCornerCount: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.print) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        velcro: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.fringe) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        velcroCornerCount: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.velcro) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        led: Yup.string().required('bu alan zorunlu'),
        ledQty: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.led) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        ledType: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.led) === 2) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        ledText: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.led) === 2) {
                if (parseInt(formik.values.ledType) === 3) {
                    if (formik.values.ledText !== "") {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else {
                return true
            }
        }),
        qty: Yup.number().moreThan(0, 'Bu alan zorunlu ve 0 dan büyük olmalı'),
        price: Yup.number().moreThan(0, 'Bu alan zorunlu ve 0 dan büyük olmalı'),
        taxType: Yup.string().required('bu alan zorunlu'),
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
                fd.append("ProductId", 7)
                fd.append("OrderDetailNote", formik.values.orderNote)

                fd.append("Qty", formik.values.qty)
                fd.append("Body", formik.values.body)
                fd.append("Tax", 1)
                fd.append("TaxType", formik.values.taxType)
                fd.append("Price", formik.values.price)
                fd.append("Shape", formik.values.shape)
                fd.append("ShapeSizeType", formik.values.shapeSizeType)
                fd.append("Fabric", formik.values.fabric)
                if ((parseInt(formik.values.fabric) !== 3) || (parseInt(formik.values.fabric) !== 4)) {
                    fd.append("FabricChartId", parseInt(formik.values.fabricChartId))
                }
                // if (parseInt(formik.values.fabric) === 1) {
                //     fd.append("AcrylicFabricChartCode", formik.values.acrylicColor)
                // }
                // if (parseInt(formik.values.fabric) === 2) {
                //     fd.append("LocalFabricChartCode", formik.values.localColor)
                // }
                if (parseInt(formik.values.fabric) === 3) {
                    fd.append("FabricText", formik.values.fabricText)
                }
                fd.append("StandType", formik.values.standType)
                if (parseInt(formik.values.standType) === 9) {
                    fd.append("StandText", formik.values.standText)
                }
                fd.append("Fringe", formik.values.fringe)
                if (parseInt(formik.values.standType) === 2) {
                    fd.append("MarbleStatus", formik.values.marbleStatus)
                }
                if (parseInt(formik.values.standType) === 3) {
                    fd.append("FlansType", formik.values.flansType)
                }
                if (parseInt(formik.values.marbleStatus) === 2) {
                    fd.append("MarbleType", formik.values.marbleType)
                }
                if (parseInt(formik.values.fringe) === 2) {
                    fd.append("Print", formik.values.print)
                    if (parseInt(formik.values.print) === 2) {
                        fd.append("PrintCornerCount", formik.values.printCornerCount)
                        fd.append("PrintText", formik.values.printText)
                    }
                    fd.append("Velcro", formik.values.velcro)
                    if (parseInt(formik.values.velcro) === 2) {
                        fd.append("VelcroCornerCount", formik.values.velcroCornerCount)
                        fd.append("VelcroText", formik.values.velcroText)
                    }
                    fd.append("BiasText", formik.values.biasText)
                }
                fd.append("Led", formik.values.led)
                if (parseInt(formik.values.led) === 2) {
                    fd.append("LedQty", formik.values.ledQty)
                    fd.append("LedType", formik.values.ledType)
                    fd.append("LedText", formik.values.ledText)
                }

                if (update) {
                    await UpdateWoodenUmbrella(fd).then((res) => {
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
                    // await getListStockControl(fd).then(async (res) => {
                    //     if (res?.errors || res?.statusCode === 400 || res?.statusCode === 500) {
                    //         openSnackbar({
                    //             open: true,
                    //             message: `${res?.message ? res?.message : 'Error'}`,
                    //             variant: 'alert',
                    //             alert: {
                    //                 color: 'error'
                    //             },
                    //             close: false
                    //         })
                    //     } else {
                    //         if (res?.data?.length !== 0) {
                    //             setFormDt(fd)
                    //             setStockData(res?.data)
                    //             setStockModal(true)
                    //         } else {
                    //             const updateFd = new FormData()
                    //             updateFd.append('OrderDetailId', updateOrderId)
                    //             await restoreStock(updateFd)
                    //             await UpdateWoodenUmbrella(fd).then((res) => {
                    //                 if (res?.errors || res?.statusCode === 400 || res?.statusCode === 500) {
                    //                     openSnackbar({
                    //                         open: true,
                    //                         message: `${res?.message ? res?.message : 'Error'}`,
                    //                         variant: 'alert',
                    //                         alert: {
                    //                             color: 'error'
                    //                         },
                    //                         close: false
                    //                     })
                    //                 } else {
                    //                     navigate(`/orders/detail/product-detail/${updateOrderId}`)
                    //                 }
                    //             })
                    //         }
                    //     }
                    //     setSubmitting(false)
                    // })
                } else {
                    await CreateWoodenUmbrella(fd).then((res) => {
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
                    // await getListStockControl(fd).then(async (res) => {
                    //     if (res?.errors || res?.statusCode === 400 || res?.statusCode === 500) {
                    //         openSnackbar({
                    //             open: true,
                    //             message: `${res?.message ? res?.message : 'Error'}`,
                    //             variant: 'alert',
                    //             alert: {
                    //                 color: 'error'
                    //             },
                    //             close: false
                    //         })
                    //     } else {
                    //         if (res?.data?.length !== 0) {
                    //             setFormDt(fd)
                    //             setStockData(res?.data)
                    //             setStockModal(true)
                    //         } else {
                    //             await CreateWoodenUmbrella(fd).then((res) => {
                    //                 if (res?.errors || res?.statusCode === 400 || res?.statusCode === 500) {
                    //                     openSnackbar({
                    //                         open: true,
                    //                         message: `${res?.message ? res?.message : 'Error'}`,
                    //                         variant: 'alert',
                    //                         alert: {
                    //                             color: 'error'
                    //                         },
                    //                         close: false
                    //                     })
                    //                 } else {
                    //                     navigate(`/orders/detail/${orderId}`)
                    //                 }
                    //             })
                    //         }

                    //     }
                    //     setSubmitting(false)
                    // })
                }

            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${data?.orderId}` }, { title: 'Ürün Detayı', to: `/orders/detail/product-detail/${updateOrderId}` }, { title: 'Ürün Düzenle' }, { title: 'Akşap Şemsiye', }]

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
            <ErrorModal errors={formik.errors} open={errorModal} modalToggler={setErrorModal} />
            {/* <StockControlModal qty={prevStockData} productId={7} update={update} stockData={stockData} formDt={formDt} open={stockModal} modalToggler={setStockModal} /> */}
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
                                    <MainCard title='Şekil Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Şekil</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='shape' name="radio-shape" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('shape', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shape ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.shape === "3" ? true : false} onChange={(e) => setFieldValue('shape', "3")} name='radio-shape' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Yuvarlak
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.shape &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>

                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}>Ölçü</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='shape' name="radio-shapeSizeType" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('shapeSizeType', "14")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="14" checked={formik.values.shapeSizeType === "14" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "14")} name='radio-shapeSizeType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        250
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.shapeSizeType &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>

                                    </MainCard>
                                </Grid>



                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Gövde Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Gövde</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='body' name="radio-body" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('body', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.body ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.body === "1" ? true : false} onChange={(e) => setFieldValue('body', "1")} name='radio-body' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        15 x 25 50'lik Boru
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('body', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.body ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.body === "2" ? true : false} onChange={(e) => setFieldValue('body', "2")} name='radio-body' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        20 x 30 60'lık Boru
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.body &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Kumaş Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Kumaş</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='fabric' name="radio-fabric" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('fabric', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.fabric ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.fabric === "1" ? true : false} onChange={(e) => setFieldValue('fabric', "1")} name='radio-fabric' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Akrilik
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
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
                                                            <Box onClick={() => setFieldValue('fabric', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.fabric ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.fabric === "4" ? true : false} onChange={(e) => setFieldValue('fabric', "4")} name='radio-fabric' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Makrome
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
                                            (parseInt(formik.values.fabric) > 0 && parseInt(formik.values.fabric) !== 4) &&
                                            <Grid marginBottom={3} item xs={12}>
                                                <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}></InputLabel>
                                                <FormControl style={{ width: '100%' }} component="fieldset">
                                                    <RadioGroup id='shape' name="radio-shapeSizeType" row>
                                                        <Grid spacing={3} container >
                                                            {
                                                                parseInt(formik.values.fabric) === 1 &&
                                                                <>
                                                                    <Grid item marginBottom={3} xs={12} lg={8}>
                                                                        <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                            Renk
                                                                        </div>
                                                                        <Autocomplete
                                                                            fullWidth
                                                                            disableClearable
                                                                            id="basic-autocomplete-label"
                                                                            options={acrylicColors}
                                                                            getOptionLabel={(option) => `${option.name}` || ''}
                                                                            onChange={(e, value) => { setFieldValue('acrylicColor', value?.code); setFieldValue('fabricChartId', value?.id) }}
                                                                            value={acrylicColors?.find((item) => parseInt(item?.code) === parseInt(formik.values.acrylicColor)) || null}
                                                                            renderInput={(params) => <TextField error={Boolean(errors.acrylicColor)} helperText={errors.acrylicColor} {...params} label="Lütfen Akrilik Renk Seçiniz" />}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} lg={4} >
                                                                        <Box component="section" sx={{ width: '100%', height: '258px', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <img width="100%" height="100%" src={`/img/acrylic/acrilla-${formik.values.acrylicColor}.jpg`} alt="" />
                                                                        </Box>
                                                                    </Grid>
                                                                </>
                                                            }
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
                                                                            getOptionLabel={(option) => `${option.name}` || ''}
                                                                            onChange={(e, value) => { setFieldValue('localColor', value?.code); setFieldValue('fabricChartId', value?.id) }}
                                                                            value={localColors?.find((item) => parseInt(item?.code) === parseInt(formik.values.localColor)) || null}
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
                                                            <Box onClick={() => setFieldValue('standType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.standType === "2" ? true : false} onChange={(e) => setFieldValue('standType', "2")} name='radio-standType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Mermer Kaide
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('standType', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.standType === "4" ? true : false} onChange={(e) => setFieldValue('standType', "4")} name='radio-standType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Beton Kaide
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('standType', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.standType === "3" ? true : false} onChange={(e) => setFieldValue('standType', "3")} name='radio-standType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Flanş
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        {
                                                            parseInt(formik.values.body) !== 2 &&
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
                                                        }
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('standType', "9")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="9" checked={formik.values.standType === "9" ? true : false} onChange={(e) => setFieldValue('standType', "9")} name='radio-standType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Özel
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
                                        {
                                            parseInt(formik.values.standType) === 2 &&
                                            <>
                                                <Grid marginBottom={3} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Mermer</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='marbleStatus' name="radio-marbleStatus" row>
                                                            <Grid container spacing={3}>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('marbleStatus', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.marbleStatus ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.marbleStatus === "1" ? true : false} onChange={(e) => setFieldValue('marbleStatus', "1")} name='radio-marbleStatus' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Yok
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('marbleStatus', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.marbleStatus ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.marbleStatus === "2" ? true : false} onChange={(e) => setFieldValue('marbleStatus', "2")} name='radio-marbleStatus' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Var
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    {
                                                        errors.marbleStatus &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                                {
                                                    parseInt(formik.values.marbleStatus) === 2 &&
                                                    <Grid marginBottom={3} item xs={12}>
                                                        <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Mermer Türü</InputLabel>
                                                        <FormControl style={{ width: '100%' }} component="fieldset">
                                                            <RadioGroup id='marbleType' name="radio-marbleType" row>
                                                                <Grid container spacing={3}>
                                                                    <Grid item lg={3} xs={12}>
                                                                        <Box onClick={() => setFieldValue('marbleType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.marbleType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <label>
                                                                                <span>
                                                                                    <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.marbleType === "2" ? true : false} onChange={(e) => setFieldValue('marbleType', "2")} name='radio-marbleType' type="radio" />
                                                                                </span>
                                                                                <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                    70 x 70 (4 Mermerli)
                                                                                </span>
                                                                            </label>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item lg={3} xs={12}>
                                                                        <Box onClick={() => setFieldValue('marbleType', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.marbleType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <label>
                                                                                <span>
                                                                                    <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.marbleType === "4" ? true : false} onChange={(e) => setFieldValue('marbleType', "4")} name='radio-marbleType' type="radio" />
                                                                                </span>
                                                                                <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                    70 x 70 (8 Mermerli)
                                                                                </span>
                                                                            </label>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        {
                                                            errors.marbleType &&
                                                            <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                        }
                                                    </Grid>
                                                }
                                                {/* <Grid marginBottom={3} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Kaide Kapağı</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='marbleStatus' name="radio-marbleStatus" row>
                                                            <Grid container spacing={3}>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('marbleStatus', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shape ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.marbleStatus === "1" ? true : false} onChange={(e) => setFieldValue('marbleStatus', "1")} name='radio-marbleStatus' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Yok
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('marbleStatus', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shape ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.marbleStatus === "2" ? true : false} onChange={(e) => setFieldValue('marbleStatus', "2")} name='radio-marbleStatus' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Var
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid> */}
                                            </>
                                        }
                                        {
                                            parseInt(formik.values.standType) === 3 &&
                                            <>
                                                <Grid marginBottom={3} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Flanş Türü</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='flansType' name="radio-flansType" row>
                                                            <Grid container spacing={3}>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('flansType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.flansType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.flansType === "1" ? true : false} onChange={(e) => setFieldValue('flansType', "1")} name='radio-flansType' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                25 x 25
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    {
                                                        errors.flansType &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                            </>
                                        }
                                        {
                                            parseInt(formik.values.standType) === 9 &&
                                            <>
                                                <Grid item xs={12}>
                                                    <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                        Özel Notlar
                                                    </div>
                                                    <TextField
                                                        fullWidth
                                                        id="standText"
                                                        multiline
                                                        rows={5}
                                                        placeholder="Ayak Seçimi Açıklaması"
                                                        {...getFieldProps('standText')}
                                                        error={Boolean(touched.standText && errors.standText)}
                                                        helperText={touched.standText && errors.standText}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Saçak Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Saçak</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='fringe' name="radio-fringe" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('fringe', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.fringe ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.fringe === "1" ? true : false} onChange={(e) => setFieldValue('fringe', "1")} name='radio-fringe' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Yok
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('fringe', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.fringe ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.fringe === "2" ? true : false} onChange={(e) => setFieldValue('fringe', "2")} name='radio-fringe' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Var
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.marbleType &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>
                                        {
                                            parseInt(formik.values.fringe) === 2 &&
                                            <>
                                                <Grid marginBottom={3} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}>Baskı</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='print' name="radio-print" row>
                                                            <Grid container spacing={3}>

                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('print', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.print ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.print === "1" ? true : false} onChange={(e) => setFieldValue('print', "1")} name='radio-print' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Yok
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('print', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.print ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.print === "2" ? true : false} onChange={(e) => setFieldValue('print', "2")} name='radio-print' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Var
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    {
                                                        errors.print &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                                {
                                                    parseInt(formik.values.print) === 2 &&
                                                    <>
                                                        <Grid marginBottom={3} item xs={12}>
                                                            <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}>Baskı Köşe Sayısı</InputLabel>
                                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                                <RadioGroup id='printCornerCount' name="radio-printCornerCount" row>
                                                                    <Grid container spacing={3}>

                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.printCornerCount === "1" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "1")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        1
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.printCornerCount === "2" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "2")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        2
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.printCornerCount === "3" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "3")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        3
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.printCornerCount === "4" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "4")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        4
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "5")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="5" checked={formik.values.printCornerCount === "5" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "5")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        5
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "6")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="6" checked={formik.values.printCornerCount === "6" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "6")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        6
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "7")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="7" checked={formik.values.printCornerCount === "7" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "7")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        7
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('printCornerCount', "8")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.printCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="8" checked={formik.values.printCornerCount === "8" ? true : false} onChange={(e) => setFieldValue('printCornerCount', "8")} name='radio-printCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        8
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            {
                                                                errors.printCornerCount &&
                                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                            }
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                Saçak Baskı Yazısı
                                                            </div>
                                                            <TextField
                                                                fullWidth
                                                                id="printText"
                                                                multiline
                                                                rows={5}
                                                                placeholder="Saçak Baskı Yazısı"
                                                                {...getFieldProps('printText')}
                                                                error={Boolean(touched.printText && errors.printText)}
                                                                helperText={touched.printText && errors.printText}
                                                            />
                                                        </Grid>
                                                    </>
                                                }
                                                <Grid marginBottom={3} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}>Cırt</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='velcro' name="radio-velcro" row>
                                                            <Grid container spacing={3}>

                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('velcro', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcro ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.velcro === "1" ? true : false} onChange={(e) => setFieldValue('velcro', "1")} name='radio-velcro' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Yok
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('velcro', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcro ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.velcro === "2" ? true : false} onChange={(e) => setFieldValue('velcro', "2")} name='radio-velcro' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Var
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    {
                                                        errors.velcro &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                                {
                                                    parseInt(formik.values.velcro) === 2 &&
                                                    <>
                                                        <Grid marginBottom={3} item xs={12}>
                                                            <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}>Cırt Köşe Sayısı</InputLabel>
                                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                                <RadioGroup id='velcroCornerCount' name="radio-velcroCornerCount" row>
                                                                    <Grid container spacing={3}>

                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.velcroCornerCount === "1" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "1")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        1
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.velcroCornerCount === "2" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "2")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        2
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.velcroCornerCount === "3" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "3")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        3
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.velcroCornerCount === "4" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "4")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        4
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "5")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="5" checked={formik.values.velcroCornerCount === "5" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "5")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        5
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "6")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="6" checked={formik.values.velcroCornerCount === "6" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "6")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        6
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "7")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="7" checked={formik.values.velcroCornerCount === "7" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "7")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        7
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={1.5} xs={12}>
                                                                            <Box onClick={() => setFieldValue('velcroCornerCount', "8")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.velcroCornerCount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="8" checked={formik.values.velcroCornerCount === "8" ? true : false} onChange={(e) => setFieldValue('velcroCornerCount', "8")} name='radio-velcroCornerCount' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        8
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            {
                                                                errors.velcroCornerCount &&
                                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                            }
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                Cırt Notları
                                                            </div>
                                                            <TextField
                                                                fullWidth
                                                                id="velcroText"
                                                                multiline
                                                                rows={5}
                                                                placeholder="Cırt Notları"
                                                                {...getFieldProps('velcroText')}
                                                                error={Boolean(touched.velcroText && errors.velcroText)}
                                                                helperText={touched.velcroText && errors.velcroText}
                                                            />
                                                        </Grid>
                                                    </>
                                                }
                                                <Grid item xs={12}>
                                                    <div style={{ marginLeft: '2px', marginBottom: '10px', marginTop: '26px', color: '#5B6B79' }}>
                                                        Renk
                                                    </div>
                                                    <TextField
                                                        fullWidth
                                                        id="biasText"
                                                        multiline
                                                        rows={5}
                                                        placeholder="Saçak Biye Renk Notları"
                                                        {...getFieldProps('biasText')}
                                                        error={Boolean(touched.biasText && errors.biasText)}
                                                        helperText={touched.biasText && errors.biasText}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </MainCard>
                                </Grid>

                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                    <MainCard title='Led Seçimi'>
                                        <Grid marginBottom={3} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Led</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='led' name="radio-led" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('led', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.led ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.led === "1" ? true : false} onChange={(e) => setFieldValue('led', "1")} name='radio-led' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Yok
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('led', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.led ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.led === "2" ? true : false} onChange={(e) => setFieldValue('led', "2")} name='radio-led' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Var
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.led &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>
                                        {
                                            parseInt(formik.values.led) === 2 &&
                                            <>
                                                <Grid marginBottom={3} item xs={12}>
                                                    <div style={{ marginLeft: '2px', marginBottom: '10px' }}>
                                                        Led Adet
                                                    </div>
                                                    <TextField
                                                        fullWidth
                                                        id="ledQty"
                                                        type='number'
                                                        placeholder="Led adet"
                                                        {...getFieldProps('ledQty')}
                                                        error={Boolean(touched.ledQty && errors.ledQty)}
                                                        helperText={touched.ledQty && errors.ledQty}
                                                    />
                                                </Grid>
                                                <Grid marginBottom={3} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px', marginTop: '36px' }}>Led Türü</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='ledType' name="radio-ledType" row>
                                                            <Grid container spacing={3}>

                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('ledType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.ledType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.ledType === "1" ? true : false} onChange={(e) => setFieldValue('ledType', "1")} name='radio-ledType' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                12 Volt Adaptörlü
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('ledType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.ledType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.ledType === "2" ? true : false} onChange={(e) => setFieldValue('ledType', "2")} name='radio-ledType' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Güneş Enerjili
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('ledType', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.ledType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.ledType === "3" ? true : false} onChange={(e) => setFieldValue('ledType', "3")} name='radio-ledType' type="radio" />
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
                                                        errors.ledType &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                                {
                                                    parseInt(formik.values.ledType) === 3 &&
                                                    <Grid item xs={12}>
                                                        <div style={{ marginLeft: '2px', marginBottom: '10px', marginTop: '26px', color: '#5B6B79' }}>
                                                            Led Türü Açıklaması
                                                        </div>
                                                        <TextField
                                                            fullWidth
                                                            id="ledText"
                                                            multiline
                                                            rows={5}
                                                            placeholder="Led Türü Açıklaması"
                                                            {...getFieldProps('ledText')}
                                                            error={Boolean(touched.ledText && errors.ledText)}
                                                            helperText={touched.ledText && errors.ledText}
                                                        />
                                                    </Grid>
                                                }
                                            </>
                                        }
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
                                        <Button onClick={() => { Object.keys(formik.errors).length !== 0 && setErrorModal(true) }} type="submit" variant="contained" disabled={isSubmitting}>
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