/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Autocomplete } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';

// project imports
import { useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { getCities, getState } from 'services/citiesServices';
import Loader from 'components/Loader';
import { AddCustomerAdress } from 'services/customersAdressServices';


const getInitialValues = () => {
    const newPriceDate = {
        adressTitle: '',
        openAddress: '',
        city: 0,
        state: ''
    };
    return newPriceDate;
};

export default function AdressAddForm({ closeModal, setIsEdit, customerId }) {
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [cities, setCities] = useState([])
    const [states, setStates] = useState([])
    const params = useParams();
    const validationSchema = Yup.object({
        adressTitle: Yup.string().required('Adres başlıgı zorunlu'),
        city: Yup.number().moreThan(0, 'Şehir zorunlu'),
        state: Yup.string().required('İlçe zorunlu'),
        openAddress: Yup.string().required('Adres zorunlu'),
    });


    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                const fd = new FormData()

                fd.append('CustomerId', params?.id)
                fd.append('Title', formik.values.adressTitle)
                fd.append('Address', formik.values.openAddress)
                fd.append("CityId", formik.values.city)
                fd.append("StateId", formik.values.state)

                await AddCustomerAdress(fd).then((res) => {
                    if (res.errors || res.statusCode === 400) {
                        openSnackbar({
                            open: true,
                            message: `${res.message ? res.message : 'Error'}`,
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    } else {
                        openSnackbar({
                            open: true,
                            message: 'Adres başarıyla eklendi!',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: false
                        })
                        setIsEdit(true)
                        closeModal()
                    }
                })
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    useEffect(() => {
        setLoading(true)
        getCities().then((res) => {
            setCities(res?.data)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (formik.values.city > 0) {
            setLoading2(true)
            getState(formik.values.city).then((res) => {
                setStates(res?.data)
                setLoading2(false)
            })
        }
    }, [formik.values.city])

    const { handleChange, handleSubmit, isSubmitting, getFieldProps, touched, errors, setFieldValue } = formik;

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Adres Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item xs={12}>
                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="villa-person">Adres Başlığı</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="adressTitle"
                                            placeholder="Adres Başlığı"
                                            {...getFieldProps('adressTitle')}
                                            error={Boolean(touched.adressTitle && errors.adressTitle)}
                                            helperText={touched.adressTitle && errors.adressTitle}
                                        />
                                    </Grid>
                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }}>İl</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            disablePortal
                                            id="city"
                                            disableClearable
                                            onChange={(e, value) => { setFieldValue('city', value.id) }}
                                            options={cities.map((item) => { return item })}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField error={Boolean(touched.city && errors.city)} helperText={touched.city && errors.city} {...params} label="İl" />}
                                        />
                                    </Grid>

                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }}>İlçe</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            disablePortal
                                            id="state"
                                            disabled={loading2}
                                            disableClearable
                                            onChange={(e, value) => { setFieldValue('state', value.id) }}
                                            options={states.map((item) => { return item })}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField error={Boolean(touched.state && errors.state)} helperText={touched.state && errors.state} {...params} label="İlçe" />}
                                        />
                                    </Grid>

                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="openAddress">Açık Adres</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="openAddress"
                                            multiline
                                            rows={5}
                                            placeholder="Açık adres"
                                            {...getFieldProps('openAddress')}
                                            error={Boolean(touched.openAddress && errors.openAddress)}
                                            helperText={touched.openAddress && errors.openAddress}
                                        />
                                    </Grid>
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


