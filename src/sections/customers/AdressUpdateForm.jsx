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
import Loader from 'components/Loader';
import { getCities, getState } from 'services/citiesServices';


const getInitialValues = (selectedAdress) => {
    const newPriceDate = {
        adressTitle: selectedAdress?.title || '',
        openAddress: selectedAdress?.address || '',
        city: selectedAdress?.cityId || 0,
        state: selectedAdress?.stateId || 0
    };
    return newPriceDate;
};

export default function AdressUpdateForm({ closeModal, setIsEdit, customerId, selectedAdress }) {
    const [loading, setLoading] = useState(true)
    const [cities, setCities] = useState([])
    const [states, setStates] = useState([
        {
            id: 0,
            name: "İlçe Seçiniz"
        }
    ])

    const params = useParams();
    const validationSchema = Yup.object({
        // amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        // paymentType: Yup.string().max(255).required('Lütfen ödemenin alındığı kasa hesabını seçiniz..')
    });

    useEffect(() => {
        async function fetchData() {
            setStates([{
                id: 0,
                name: "İlçe Seçiniz"
            }])
            await getCities().then((res) => {
                setCities(res?.data)
            })
            await getState(formik.values.city).then((res) => {
                setStates((prevValue) => [...prevValue, ...res?.data])
            })
            setLoading(false)
        }
        fetchData()
    }, [])

    const formik = useFormik({
        initialValues: getInitialValues(selectedAdress),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                console.log(values);
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    // useEffect(() => {

    // }, [formik.values.city])

    const handleChangeState = (value) => {
        async function fetchData() {
            setStates([{
                id: 0,
                name: "İlçe Seçiniz"
            }])
            await getState(formik.values.city).then((res) => {
                setStates((prevValue) => [...prevValue, ...res?.data])
            })
        }
        fetchData()
    }

    const { handleChange, handleSubmit, isSubmitting, getFieldProps, touched, errors, setFieldValue } = formik;

    if (loading) return <Loader open={loading} />

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Adres Düzenle</DialogTitle>
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
                                            disableClearable
                                            id="basic-autocomplete-label"
                                            options={cities}
                                            onChange={(e, value) => { setFieldValue('city', value.id); setFieldValue('state', 0); handleChangeState(value) }}
                                            value={cities.find((item) => item?.id === formik.values.city)}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField {...params} label="İl" />}
                                        />
                                    </Grid>

                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }}>İlçe</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            disablePortal
                                            id="basic-autocomplete-label"
                                            options={states}
                                            disableClearable
                                            onChange={(e, value) => { setFieldValue('state', value.id) }}
                                            getOptionLabel={(option) => option.name}
                                            value={states.find((item) => {
                                                if (item?.id === formik.values.state) {
                                                    return item
                                                } else if (formik.values.state === 0) {
                                                    return undefined
                                                }
                                            })}
                                            renderInput={(params) => <TextField {...params} label="İlçe" />}
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


