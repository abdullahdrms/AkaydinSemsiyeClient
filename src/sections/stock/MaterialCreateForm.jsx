/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { createMaterials, updateMaterial } from 'services/stockServices';


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
            title: ''
        };
        return newStockForm;
    }

};

export default function MaterialCreateForm({ closeModal, setIsEdit, selectedStock }) {
    const validationSchema = Yup.object({
        title: Yup.string().required('Lütfen başlık yazınız.'),
        amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        stockCode: Yup.string().required('Lütfen stok kodu yazınız.')
    });


    const formik = useFormik({
        initialValues: getInitialValues(selectedStock),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append("Name", formik.values.title)
                fd.append("StockCode", formik.values.stockCode)
                fd.append("Qty", formik.values.amount)
                fd.append("Id", selectedStock?.id)
                if (selectedStock !== undefined) {
                    await updateMaterial(fd).then((res) => {
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
                    await createMaterials(fd).then((res) => {
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

    const { handleChange, handleSubmit, isSubmitting } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{selectedStock !== undefined ? "Materyal Düzenle" : "Materyal Ekle"}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
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


