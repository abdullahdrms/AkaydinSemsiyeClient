/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Box, Autocomplete } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { createSemiFinished, getSemiFinishedDetail, updateSemiFinished } from 'services/stockServices';
import MainCard from 'components/MainCard';
import { getSkeletonCharts } from 'services/skeletonChartsServices';
import { getFabricCharts } from 'services/fabricChartsServices';
import Loader from 'components/Loader';


const getInitialValues = (selectedStock) => {
    if (selectedStock !== undefined) {
        const editStockForm = {
            amount: selectedStock?.qty || 0,
            stockCode: selectedStock?.stockCode || '',
            title: selectedStock?.name || ''
        };
        return editStockForm;
    } else {
        const newStockForm = {
            amount: 0,
            stockCode: '',
            title: '',
            stockType: 0,
            shape: 0,
            diameter: 0,
            heigth: 0,
            width: 0,
            shapeSizeType: 0,
            flue: "",
            led: 0,
            ledType: 0,
            electric: 0,
            skeletonChartId: 0,
            fabricChartId: 0,
            fabric: "",
            acrylicColor: 0,
            localColor: 0,
            fringe: "",
            standType: ""
        };
        return newStockForm;
    }

};

export default function SemiFinishedCreateForm({ closeModal, setIsEdit, selectedStock }) {
    const [loading, setLoading] = useState(true)
    const [semiProductDetail, setSemiProductDetail] = useState({})
    const [localColors, setLocalColors] = useState([])
    const [acrylicColors, setAcrylicColors] = useState([])
    const [skeletonCharts, setSkeletonCharts] = useState([])

    useEffect(() => {
        async function fetchData() {
            await getFabricCharts().then((res) => {
                res?.data?.map((item) => {
                    if (item?.colorType === 2) {
                        setLocalColors((prevValues) => [...prevValues, item])
                    } else if (item?.colorType === 1) {
                        setAcrylicColors((prevValues) => [...prevValues, item])
                    }
                })
                getSkeletonCharts().then((res) => {
                    res?.data?.map((item) => {
                        setSkeletonCharts((prevValues) => [...prevValues, item])
                    })
                    setLoading(false)
                })
            })
        }
        if (selectedStock === undefined) {
            fetchData()
        } else {
            getSemiFinishedDetail(selectedStock?.id).then((res) => {
                setSemiProductDetail(res?.data)
                setLoading(false)
            })
        }
    }, [])


    const validationSchema = Yup.object({
        title: Yup.string().required('Lütfen başlık yazınız.'),
        amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        stockCode: Yup.string().required('Lütfen stok kodu yazınız.'),
        // stockType: Yup.number().min(1).required('Lütfen stok tipi seçiniz.'),
        stockType: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
            if (selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        width: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.shape) === 4 && (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2)) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        heigth: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.shape) === 4 && (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2)) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        diameter: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.shape) === 3 && (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2)) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        shape: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        flue: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        led: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 1 && selectedStock === undefined) {
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
            if (parseInt(formik.values.led) === 2 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        electric: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 1 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        skeletonChartId: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 1 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        fabric: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 2 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        fabricChartId: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.fabric) === 2 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        fringe: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 2 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
        standType: Yup.string().test("isValid", "Bu alan zorunlu", (value) => {
            if (parseInt(formik.values.stockType) === 3 && selectedStock === undefined) {
                if (parseInt(value) > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }),
    });


    const formik = useFormik({
        initialValues: getInitialValues(selectedStock),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                if (selectedStock === undefined) {
                    fd.append("StockType", parseInt(formik.values.stockType))
                }
                if (parseInt(formik.values.stockType) === 1 || parseInt(values.stockType) === 2) {
                    fd.append("Shape", parseInt(formik.values.shape))
                    if (parseInt(formik.values.shape) < 3) {
                        fd.append("ShapeSizeType", parseInt(formik.values.shapeSizeType))
                    } else if (parseInt(formik.values.shape) === 3) {
                        fd.append("Diameter", parseInt(formik.values.diameter))
                    } else if (parseInt(formik.values.shape) === 4) {
                        fd.append("Width", parseInt(formik.values.width))
                        fd.append("Height", parseInt(formik.values.heigth))
                    }
                    fd.append("Flue", parseInt(formik.values.flue))
                    if (parseInt(formik.values.stockType) === 1) {
                        fd.append("SkeletonChartId", parseInt(formik.values.skeletonChartId))
                        fd.append("Electric", parseInt(formik.values.electric))
                        fd.append("Led", parseInt(formik.values.led))
                        if (parseInt(formik.values.led) === 2) {
                            fd.append("LedType", parseInt(formik.values.ledType))
                        }
                    } else if (parseInt(formik.values.stockType) === 2) {
                        fd.append("Fabric", parseInt(formik.values.fabric))
                        fd.append("FabricChartId", parseInt(formik.values.fabricChartId))
                        fd.append("Fringe", parseInt(formik.values.fringe))
                    }
                } else if (parseInt(formik.values.stockType) === 3) {
                    fd.append("StandType", parseInt(formik.values.standType))
                }
                fd.append("Name", formik.values.title)
                fd.append("StockCode", formik.values.stockCode)
                fd.append("Qty", formik.values.amount)
                if (selectedStock !== undefined) {
                    fd.append("Id", selectedStock?.id)
                }

                if (selectedStock !== undefined) {
                    await updateSemiFinished(fd).then((res) => {
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
                            setIsEdit(true)
                            closeModal()
                        }
                    })
                } else {
                    await createSemiFinished(fd).then((res) => {
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
                            setIsEdit(true)
                            closeModal()
                        }
                    })
                }
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    const { handleChange, handleSubmit, isSubmitting, errors, setFieldValue, values, getFieldProps } = formik;

    if (loading) return <Loader open={loading} />

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{selectedStock !== undefined ? "Yarı Mamul Düzenle" : "Yarı Mamul Ekle"}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                {
                                    selectedStock === undefined &&
                                    <>
                                        <Grid marginBottom={0} item xs={12}>
                                            <InputLabel style={{ marginBottom: '20px' }}>Stok Tipi</InputLabel>
                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                <RadioGroup id='shape' name="radio-shape" row>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('stockType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.stockType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.stockType === "1" ? true : false} onChange={(e) => setFieldValue('stockType', "1")} name='radio-stockType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        İskelet
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('stockType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.stockType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label>
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.stockType === "2" ? true : false} onChange={(e) => setFieldValue('stockType', "2")} name='radio-stockType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Kumaş
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item lg={3} xs={12}>
                                                            <Box onClick={() => setFieldValue('stockType', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.stockType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <label htmlFor="">
                                                                    <span>
                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.stockType === "3" ? true : false} onChange={(e) => setFieldValue('stockType', "3")} name='radio-stockType' type="radio" />
                                                                    </span>
                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                        Ayak
                                                                    </span>
                                                                </label>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>
                                            {
                                                errors.stockType &&
                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                            }
                                        </Grid>
                                        {
                                            (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2) &&
                                            <Grid marginBottom={0} item xs={12}>
                                                <InputLabel style={{ marginBottom: '20px' }}>Şekil</InputLabel>
                                                <FormControl style={{ width: '100%' }} component="fieldset">
                                                    <RadioGroup id='shape' name="radio-shape" row>
                                                        <Grid container spacing={3}>
                                                            <Grid item lg={3} xs={12}>
                                                                <Box onClick={() => setFieldValue('shape', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shape ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                    <label>
                                                                        <span>
                                                                            <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.shape === "1" ? true : false} onChange={(e) => setFieldValue('shape', "1")} name='radio-shape' type="radio" />
                                                                        </span>
                                                                        <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                            Kare
                                                                        </span>
                                                                    </label>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item lg={3} xs={12}>
                                                                <Box onClick={() => setFieldValue('shape', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shape ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                    <label>
                                                                        <span>
                                                                            <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.shape === "2" ? true : false} onChange={(e) => setFieldValue('shape', "2")} name='radio-shape' type="radio" />
                                                                        </span>
                                                                        <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                            Diktörtgen
                                                                        </span>
                                                                    </label>
                                                                </Box>
                                                            </Grid>
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
                                                            <Grid item lg={3} xs={12}>
                                                                <Box onClick={() => setFieldValue('shape', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shape ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                    <label htmlFor="">
                                                                        <span>
                                                                            <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.shape === "4" ? true : false} onChange={(e) => setFieldValue('shape', "4")} name='radio-shape' type="radio" />
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
                                                    errors.shape &&
                                                    <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                }
                                            </Grid>
                                        }
                                        {
                                            (parseInt(formik.values.shape) > 0 && (parseInt(formik.values.stockType) === 1 || parseInt(formik.values.stockType) === 2)) &&
                                            <>
                                                <Grid marginBottom={0} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px' }}>Ölçü</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='shape' name="radio-shapeSizeType" row>
                                                            <Grid container spacing={3}>
                                                                {
                                                                    parseInt(formik.values.shape) === 1 &&
                                                                    <>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.shapeSizeType === "1" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "1")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        200 x 200
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.shapeSizeType === "2" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "2")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        250 x 250
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.shapeSizeType === "3" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "3")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        300 x 300
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "4")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="4" checked={formik.values.shapeSizeType === "4" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "4")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        350 x 350
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "5")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="5" checked={formik.values.shapeSizeType === "5" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "5")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        400 x 400
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "6")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="6" checked={formik.values.shapeSizeType === "6" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "6")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        450 x 450
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "7")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="7" checked={formik.values.shapeSizeType === "7" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "7")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        500 x 500
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "8")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="8" checked={formik.values.shapeSizeType === "8" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "8")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        550 x 550
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "9")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label htmlFor="">
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="9" checked={formik.values.shapeSizeType === "9" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "9")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        600 x 600
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                    </>
                                                                }
                                                                {
                                                                    parseInt(formik.values.shape) === 2 &&
                                                                    <>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "10")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="10" checked={formik.values.shapeSizeType === "10" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "10")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        300 x 400
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "11")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="11" checked={formik.values.shapeSizeType === "11" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "11")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        400 x 500
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "12")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="12" checked={formik.values.shapeSizeType === "12" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "12")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        500 x 600
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item lg={3} xs={12}>
                                                                            <Box onClick={() => setFieldValue('shapeSizeType', "13")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.shapeSizeType ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                                <label>
                                                                                    <span>
                                                                                        <input style={{ width: '20px', height: '20px' }} value="13" checked={formik.values.shapeSizeType === "13" ? true : false} onChange={(e) => setFieldValue('shapeSizeType', "13")} name='radio-shapeSizeType' type="radio" />
                                                                                    </span>
                                                                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                        400 x 600
                                                                                    </span>
                                                                                </label>
                                                                            </Box>
                                                                        </Grid>
                                                                    </>
                                                                }
                                                                {
                                                                    parseInt(formik.values.shape) === 3 &&
                                                                    <>
                                                                        <Grid item xs={12}>
                                                                            <Grid container spacing={3}>
                                                                                <Grid marginBottom={3} item xs={12} lg={3}>
                                                                                    <div style={{ marginLeft: '2px', marginBottom: '10px' }}>
                                                                                        Çap
                                                                                    </div>
                                                                                    <TextField
                                                                                        fullWidth
                                                                                        id="diameter"
                                                                                        type='number'
                                                                                        placeholder="çap"
                                                                                        {...getFieldProps('diameter')}
                                                                                        error={Boolean(errors.diameter)}
                                                                                        helperText={errors.diameter}
                                                                                    />
                                                                                    <p style={{ marginLeft: '2px', fontSize: '13px', color: '#a1a5b7' }}>Ölçü birimi Milimetre'dir.</p>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </>
                                                                }
                                                                {
                                                                    parseInt(formik.values.shape) === 4 &&
                                                                    <>
                                                                        <Grid item xs={12}>
                                                                            <Grid container spacing={3}>
                                                                                <Grid marginBottom={3} item xs={12} lg={3}>
                                                                                    <div style={{ marginLeft: '2px', marginBottom: '10px' }}>
                                                                                        En
                                                                                    </div>
                                                                                    <TextField
                                                                                        fullWidth
                                                                                        id="width"
                                                                                        type='number'
                                                                                        placeholder="width"
                                                                                        {...getFieldProps('width')}
                                                                                        error={Boolean(errors.width)}
                                                                                        helperText={errors.width}
                                                                                    />
                                                                                    <p style={{ marginLeft: '2px', fontSize: '13px', color: '#a1a5b7' }}>Ölçü birimi Milimetre'dir.</p>
                                                                                </Grid>
                                                                                <Grid marginBottom={3} item xs={12} lg={3}>
                                                                                    <div style={{ marginLeft: '2px', marginBottom: '10px' }}>
                                                                                        Boy
                                                                                    </div>
                                                                                    <TextField
                                                                                        fullWidth
                                                                                        id="heigth"
                                                                                        type='number'
                                                                                        placeholder="heigth"
                                                                                        {...getFieldProps('heigth')}
                                                                                        error={Boolean(errors.heigth)}
                                                                                        helperText={errors.heigth}
                                                                                    />
                                                                                    <p style={{ marginLeft: '2px', fontSize: '13px', color: '#a1a5b7' }}>Ölçü birimi Milimetre'dir.</p>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </>
                                                                }
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    {
                                                        errors.shapeSizeType &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                                <Grid marginBottom={0} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px' }}>Baca</InputLabel>
                                                    <FormControl style={{ width: '100%' }} component="fieldset">
                                                        <RadioGroup id='flue' name="radio-flue" row>
                                                            <Grid container spacing={3}>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('flue', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.flue ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label>
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.flue === "1" ? true : false} onChange={(e) => setFieldValue('flue', "1")} name='radio-flue' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Yok
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('flue', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.flue ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.flue === "2" ? true : false} onChange={(e) => setFieldValue('flue', "2")} name='radio-flue' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Bacalı
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item lg={3} xs={12}>
                                                                    <Box onClick={() => setFieldValue('flue', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.flue ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                        <label htmlFor="">
                                                                            <span>
                                                                                <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.flue === "3" ? true : false} onChange={(e) => setFieldValue('flue', "3")} name='radio-flue' type="radio" />
                                                                            </span>
                                                                            <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                Havalandırmalı
                                                                            </span>
                                                                        </label>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    {
                                                        errors.flue &&
                                                        <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                    }
                                                </Grid>
                                            </>
                                        }

                                        {
                                            (parseInt(formik.values.stockType) === 1) &&
                                            <>
                                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                                    <Grid spacing={3} container >
                                                        <Grid item marginBottom={0} xs={12}>
                                                            <InputLabel style={{ marginBottom: '20px' }}>İskelet Renk Kartelası</InputLabel>
                                                            <Autocomplete
                                                                fullWidth
                                                                disableClearable
                                                                id="basic-autocomplete-label"
                                                                options={skeletonCharts}
                                                                getOptionLabel={(option) => `${option?.name}` || ''}
                                                                onChange={(e, value) => setFieldValue("skeletonChartId", value?.id)}
                                                                value={skeletonCharts?.find((item) => item?.id === parseInt(formik.values.skeletonChartId)) || null}
                                                                renderInput={(params) => <TextField error={Boolean(errors.skeletonChartId)} helperText={errors.skeletonChartId} {...params} label="İskelet Renk Seçimi" />}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid marginBottom={0} item xs={12}>
                                                    <InputLabel style={{ marginBottom: '20px' }}>Led</InputLabel>
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
                                                        <Grid marginBottom={0} item xs={12}>
                                                            <InputLabel style={{ marginBottom: '20px' }}>Led Türü</InputLabel>
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
                                                                    </Grid>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            {
                                                                errors.ledType &&
                                                                <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                            }
                                                        </Grid>
                                                    </>
                                                }
                                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                                    <Grid marginBottom={0} item xs={12}>
                                                        <InputLabel style={{ marginBottom: '20px' }}>Elektrik</InputLabel>
                                                        <FormControl style={{ width: '100%' }} component="fieldset">
                                                            <RadioGroup id='electric' name="radio-electric" row>
                                                                <Grid container spacing={3}>
                                                                    <Grid item lg={3} xs={12}>
                                                                        <Box onClick={() => setFieldValue('electric', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.electric ? '#dc2626' : 'grey'}`, marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <label>
                                                                                <span>
                                                                                    <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.electric === "1" ? true : false} onChange={(e) => setFieldValue('electric', "1")} name='radio-electric' type="radio" />
                                                                                </span>
                                                                                <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                    Yok
                                                                                </span>
                                                                            </label>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item lg={3} xs={12}>
                                                                        <Box onClick={() => setFieldValue('electric', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.electric ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <label htmlFor="">
                                                                                <span>
                                                                                    <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.electric === "2" ? true : false} onChange={(e) => setFieldValue('electric', "2")} name='radio-electric' type="radio" />
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
                                                            errors.electric &&
                                                            <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                        {
                                            (parseInt(formik.values.stockType) === 2) &&
                                            <>
                                                <Grid item xs={12}>
                                                    <Grid marginBottom={0} item xs={12}>
                                                        <InputLabel style={{ marginBottom: '20px' }}>Kumaş</InputLabel>
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
                                                        <Grid marginBottom={0} item xs={12}>
                                                            <InputLabel style={{ marginBottom: '20px' }}></InputLabel>
                                                            <FormControl style={{ width: '100%' }} component="fieldset">
                                                                <RadioGroup id='shape' name="radio-shapeSizeType" row>
                                                                    <Grid spacing={3} container >
                                                                        {
                                                                            parseInt(formik.values.fabric) === 1 &&
                                                                            <>
                                                                                <Grid item marginBottom={3} xs={12}>
                                                                                    <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                                        Renk
                                                                                    </div>
                                                                                    <Autocomplete
                                                                                        fullWidth
                                                                                        disableClearable
                                                                                        id="basic-autocomplete-label"
                                                                                        options={acrylicColors}
                                                                                        getOptionLabel={(option) => `${option?.name}` || ''}
                                                                                        onChange={(e, value) => { setFieldValue('acrylicColor', value?.code); setFieldValue('fabricChartId', value?.id) }}
                                                                                        value={acrylicColors?.find((item) => parseInt(item?.code) === parseInt(formik.values.acrylicColor)) || null}
                                                                                        renderInput={(params) => <TextField error={Boolean(errors.acrylicColor)} helperText={errors.acrylicColor} {...params} label="Lütfen Akrilik Renk Seçiniz" />}
                                                                                    />
                                                                                </Grid>
                                                                            </>
                                                                        }
                                                                        {
                                                                            parseInt(formik.values.fabric) === 2 &&
                                                                            <>
                                                                                <Grid item marginBottom={3} xs={12}>
                                                                                    <div style={{ marginLeft: '2px', marginBottom: '10px', color: '#5B6B79' }}>
                                                                                        Renk
                                                                                    </div>
                                                                                    <Autocomplete
                                                                                        fullWidth
                                                                                        id="basic-autocomplete-label"
                                                                                        options={localColors}
                                                                                        disableClearable
                                                                                        getOptionLabel={(option) => `${option?.name}` || ''}
                                                                                        onChange={(e, value) => { setFieldValue('localColor', value?.code); setFieldValue('fabricChartId', value?.id) }}
                                                                                        value={localColors?.find((item) => parseInt(item?.code) === parseInt(formik.values.localColor)) || null}
                                                                                        renderInput={(params) => <TextField error={Boolean(errors.localColor)} helperText={errors.localColor} {...params} label="Lütfen Yerli Renk Seçiniz" />}
                                                                                    />
                                                                                </Grid>
                                                                            </>
                                                                        }
                                                                    </Grid>

                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    }
                                                </Grid>
                                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                                    <Grid marginBottom={0} item xs={12}>
                                                        <InputLabel style={{ marginBottom: '20px' }}>Saçak</InputLabel>
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
                                                            errors.fringe &&
                                                            <p style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.75rem', textAlign: 'left' }}>Bu alan zorunlu</p>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                        {
                                            (parseInt(formik.values.stockType) === 3) &&
                                            <>
                                                <Grid style={{ marginBottom: '12px' }} item xs={12}>
                                                    <Grid marginBottom={3} item xs={12}>
                                                        <InputLabel style={{ marginBottom: '20px', marginTop: '16px' }}>Ayak</InputLabel>
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
                                                                        <Box onClick={() => setFieldValue('standType', "7")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <label htmlFor="">
                                                                                <span>
                                                                                    <input style={{ width: '20px', height: '20px' }} value="7" checked={formik.values.standType === "7" ? true : false} onChange={(e) => setFieldValue('standType', "7")} name='radio-standType' type="radio" />
                                                                                </span>
                                                                                <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                    Yere Montaj
                                                                                </span>
                                                                            </label>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item lg={3} xs={12}>
                                                                        <Box onClick={() => setFieldValue('standType', "8")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.standType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                            <label htmlFor="">
                                                                                <span>
                                                                                    <input style={{ width: '20px', height: '20px' }} value="8" checked={formik.values.standType === "8" ? true : false} onChange={(e) => setFieldValue('standType', "8")} name='radio-standType' type="radio" />
                                                                                </span>
                                                                                <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                                                    Mermere Montaj
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
                                                </Grid>
                                            </>
                                        }
                                    </>
                                }
                                {
                                    (semiProductDetail?.stockType === 1 || semiProductDetail?.stockType === 2) &&
                                    <>
                                        <Grid item xs={2}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="title">Şekil</InputLabel>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={10}>
                                            {
                                                (semiProductDetail?.shape === 1 || semiProductDetail?.shape === 2 || semiProductDetail?.shape === 4) ?
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.shape === 1 ? 'Kare =' : semiProductDetail?.shape === 2 ? 'Dikdörtgen =' : semiProductDetail?.shape === 4 ? 'Özel =' : ''}  {semiProductDetail?.width} x {semiProductDetail?.height}
                                                    </Stack> : <Stack spacing={1}>
                                                        Yuvarlak = {semiProductDetail?.diameter} mm
                                                    </Stack>
                                            }
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="title">Baca</InputLabel>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Stack spacing={1}>
                                                {semiProductDetail?.flue === 1 ? 'Yok' : semiProductDetail?.flue === 2 ? 'Bacalı' : semiProductDetail?.flue === 3 ? 'Havalandırmalı' : ''}
                                            </Stack>
                                        </Grid>
                                        {
                                            semiProductDetail?.stockType === 1 &&
                                            <>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">İskelet Renk Kartelası</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.skeletonChart?.name}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">Elektrik</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.electric === 2 ? 'Var' : 'Yok'}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">Led</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.led === 2 ? 'Var' : 'Yok'}
                                                    </Stack>
                                                </Grid>
                                                {
                                                    semiProductDetail?.led === 2 &&
                                                    <>
                                                        <Grid item xs={2}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="title">Led Türü</InputLabel>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                            <Stack spacing={1}>
                                                                {semiProductDetail?.ledType === 1 ? 'Adaptörlü 12V' : 'Güneş Enerjili'}
                                                            </Stack>
                                                        </Grid>
                                                    </>
                                                }
                                            </>
                                        }
                                        {
                                            semiProductDetail?.stockType === 2 &&
                                            <>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">Kumaş</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.fabric === 1 ? 'Akrilik' : semiProductDetail?.fabric === 2 ? 'Lokal' : semiProductDetail?.fabric === 4 ? 'Makrome' : ''}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">Kumaş Renk Kodu</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.fabricChart?.name}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">Saçak</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.fringe === 2 ? 'Var' : 'Yok'}
                                                    </Stack>
                                                </Grid>
                                            </>
                                        }
                                        {
                                            semiProductDetail?.stockType === 3 &&
                                            <>
                                                <Grid item xs={2}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="title">Ayak Türü</InputLabel>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Stack spacing={1}>
                                                        {semiProductDetail?.standType === 1 ? 'Ayaksız' : semiProductDetail?.standType === 2 ? 'Mermer' : semiProductDetail?.standType === 3 ? 'Flanş' : semiProductDetail?.standType === 4 ? 'Beton' : semiProductDetail?.standType === 6 ? 'Bidon' : semiProductDetail?.standType === 7 ? 'Yere Montaj' : semiProductDetail?.standType === 8 ? 'Mermere Montaj' : ''}
                                                    </Stack>
                                                </Grid>
                                            </>
                                        }

                                    </>
                                }
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="title">Başlık</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="title"
                                            name="title"
                                            placeholder="Başlık Yazınız.."
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="stockCode">Stok Kodu</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="stockCode"
                                            name="stockCode"
                                            placeholder="Stok kodu Yazınız.."
                                            value={formik.values.stockCode}
                                            onChange={formik.handleChange}
                                            error={formik.touched.stockCode && Boolean(formik.errors.stockCode)}
                                            helperText={formik.touched.stockCode && formik.errors.stockCode}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Amount *</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="amount"
                                            name="amount"
                                            placeholder="Tutar Yazınız.."
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                                            helperText={formik.touched.amount && formik.errors.amount}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="end">
                                <Stack direction="row" spacing={2} alignItems="end">
                                    <Button type="submit" variant="contained" size='large'>
                                        KAYDET
                                    </Button>
                                </Stack>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}


