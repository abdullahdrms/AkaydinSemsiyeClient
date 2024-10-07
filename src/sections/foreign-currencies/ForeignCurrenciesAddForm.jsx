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
import { AddForeign, UpdateForeign } from 'services/foreignCurrenciesService';


const getInitialValues = (selectedStock) => {
    if (selectedStock !== undefined) {
        const editStockForm = {
            amount: selectedStock?.price || 0,
            year: `${selectedStock?.year}` || '',
            month: selectedStock?.month || 0,
        };
        return editStockForm;
    } else {
        const newStockForm = {
            amount: 0,
            year: '',
            month: 0
        };
        return newStockForm;
    }

};

export default function ForeignCurrenciesAddForm({ closeModal, setIsEdit, selectedStock }) {
    const [loading, setLoading] = useState(false)


    const validationSchema = Yup.object({
        amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        month: Yup.number().min(1, 'Lütfen ay giriniz..').required('Lütfen ay giriniz..'),
        year: Yup.string().required('Lütfen yıl giriniz.')
    });


    const formik = useFormik({
        initialValues: getInitialValues(selectedStock),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append('Month', values.month)
                fd.append('Year', values.year)
                fd.append('Price', values.amount.toString().replace('.', ','))
                if (selectedStock !== undefined) {
                    fd.append("Id", selectedStock?.id)
                }

                if (selectedStock !== undefined) {
                    await UpdateForeign(fd).then((res) => {
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
                    await AddForeign(fd).then((res) => {
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

    const turkishMonths = [
        {
            id: 1,
            name: "Ocak",
            shortName: "Oca"
        },
        {
            id: 2,
            name: "Şubat",
            shortName: "Şub"
        },
        {
            id: 3,
            name: "Mart",
            shortName: "Mar"
        },
        {
            id: 4,
            name: "Nisan",
            shortName: "Nis"
        },
        {
            id: 5,
            name: "Mayıs",
            shortName: "May"
        },
        {
            id: 6,
            name: "Haziran",
            shortName: "Haz"
        },
        {
            id: 7,
            name: "Temmuz",
            shortName: "Tem"
        },
        {
            id: 8,
            name: "Ağustos",
            shortName: "Ağu"
        },
        {
            id: 9,
            name: "Eylül",
            shortName: "Eyl"
        },
        {
            id: 10,
            name: "Ekim",
            shortName: "Eki"
        },
        {
            id: 11,
            name: "Kasım",
            shortName: "Kas"
        },
        {
            id: 12,
            name: "Aralık",
            shortName: "Ara"
        }
    ]

    const years = () => {
        let currentDate = new Date().getFullYear()
        let list = []

        for (let index = 2022; index <= currentDate; index++) {
            list.push(`${index}`)
        }
        return list
    }

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{selectedStock !== undefined ? "Kur Düzenle" : "Kur Ekle"}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Price *</InputLabel>
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

                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Yıl</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Autocomplete
                                        fullWidth
                                        disableClearable
                                        id="basic-autocomplete-label"
                                        options={years()}
                                        value={years().find((itm) => itm === formik.values.year) || null}
                                        onChange={(e, value) => setFieldValue("year", value.toString())}
                                        renderInput={(params) => <TextField error={Boolean(errors.year)} helperText={errors.year} {...params} label="Yıl seçimi" />}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Ay</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Autocomplete
                                        fullWidth
                                        disableClearable
                                        id="basic-autocomplete-label"
                                        options={turkishMonths}
                                        value={turkishMonths.find((itm) => itm.id === formik.values.month) || null}
                                        getOptionLabel={(option) => `${option?.name}` || ''}
                                        onChange={(e, value) => setFieldValue("month", value?.id)}
                                        renderInput={(params) => <TextField error={Boolean(errors.month)} helperText={errors.month} {...params} label="Ay seçimi" />}
                                    />
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


