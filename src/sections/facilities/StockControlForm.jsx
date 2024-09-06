/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Box } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { createSemiFinished, restoreStock, updateSemiFinished } from 'services/stockServices';
import { CreateBeachUmbrella, CreateCamellia, CreateClassicUmbrella, CreateEcoUmbrella, CreateLuxuryUmbrella, CreateSidePoloUmbrella, CreateWoodenUmbrella, UpdateBeachUmbrella, UpdateCamellia, UpdateClassicUmbrella, UpdateEcoUmbrella, UpdateLuxuryUmbrella, UpdateSidePoloUmbrella, UpdateWoodenUmbrella } from 'services/ordersServices';
import { useNavigate } from 'react-router';


const getInitialValues = () => {
    const newStockForm = {

    };
    return newStockForm;
};

export default function StockControlForm({ closeModal, setSelectedStock, stockData, formDt, update, productId, qty }) {
    const navigate = useNavigate()
    const orderId = location.pathname.replace('/orders/detail/create-product/', '').split('/')[0]
    const updateOrderId = location.pathname.replace('/orders/detail/update-product/', '').split('/')[0]
    const [idList, setIdList] = useState([{ id: 0 }])

    const validationSchema = Yup.object({

    });

    useEffect(() => {
        console.log(idList);

    }, [idList])



    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = formDt
                idList.map((item, i) => {
                    if (item?.id !== 0) {
                        fd.append(`ids[${i - 1}]`, item?.id)
                    }
                })
                if (update) {
                    const updateFd = new FormData()
                    updateFd.append('OrderDetailId', updateOrderId)
                    await restoreStock(updateFd)
                    if (productId === 1) {
                        await UpdateClassicUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 2) {
                        await UpdateCamellia(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 3) {
                        await UpdateLuxuryUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 4) {
                        await UpdateEcoUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 5) {
                        await UpdateSidePoloUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 7) {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 8) {
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
                                closeModal()
                                navigate(`/orders/detail/product-detail/${updateOrderId}`)
                            }
                            setSubmitting(false)
                        })
                    }
                } else {
                    if (productId === 1) {
                        await CreateClassicUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 2) {
                        await CreateCamellia(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                        })
                    } else if (productId === 3) {
                        await CreateLuxuryUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 4) {
                        await CreateEcoUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 5) {
                        await CreateSidePoloUmbrella(fd).then((res) => {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 7) {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                            setSubmitting(false)
                        })
                    } else if (productId === 8) {
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
                                closeModal()
                                navigate(`/orders/detail/${orderId}`)
                            }
                            setSubmitting(false)
                        })
                    }
                }
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    const onChangeList = (id) => {
        setIdList((prevValues) => {
            const exists = prevValues.some((item) => item?.id === id);
            if (exists) {
                return prevValues.filter((item) => item?.id !== id);
            } else {
                return [...prevValues, { id: id }];
            }
        });
    };

    const { handleChange, handleSubmit, isSubmitting, errors, values, setFieldValue } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Stok Seçimi</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                {
                                    stockData?.map((item, i) => {
                                        const isChecked = idList.find((el) => el?.id === item?.id) ? true : false;
                                        return (
                                            <Grid key={i} item lg={4} xs={12}>
                                                <Box onClick={() => onChangeList(item?.id)} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.amount ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                    <label style={{ cursor: 'pointer' }} htmlFor="">
                                                        <span>
                                                            <input style={{ width: '20px', height: '20px', cursor: 'pointer' }} checked={isChecked} onChange={(e) => e.target.value}  type="radio" />
                                                        </span>
                                                        <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                            {item?.name}
                                                        </span>
                                                        <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                                            {" - "} {update ? item?.qty + (item?.stockType === 1 ? parseInt(qty.stockSkeletonQty) : item?.stockType === 2 ? parseInt(qty.stockFabricQty) : parseInt(qty?.stockStandQty)) : item?.qty} adet
                                                        </span>
                                                    </label>
                                                </Box>
                                            </Grid>
                                        )
                                    })
                                }

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


