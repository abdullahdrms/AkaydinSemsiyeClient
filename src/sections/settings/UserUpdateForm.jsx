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
import { UpdateUser } from 'services/userServices';


const getInitialValues = (selectedUser) => {
    const newPriceDate = {
        name: selectedUser?.name || '',
        surname: selectedUser?.surName || '',
        telephone: ''
    };
    return newPriceDate;
};

export default function UserUpdateForm({ closeModal, setIsEdit, customerId, selectedUser }) {
    const validationSchema = Yup.object({
        name: Yup.string().required('Bu Alan Zorunlu'),
        surname: Yup.string().required('Bu Alan Zorunlu'),
        telephone: Yup.string().required('Bu Alan Zorunlu')
    });


    const formik = useFormik({
        initialValues: getInitialValues(selectedUser),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append("Name", values.name)
                fd.append("Surname", values.surname)
                fd.append("PhoneNumber", values.telephone)
                fd.append('Id', selectedUser?.id)

                await UpdateUser(fd).then((res) => {
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
                            message: 'User başarıyla güncellendi!',
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

    const { handleChange, handleSubmit, isSubmitting, getFieldProps, touched, errors } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Kullanıcı Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item xs={12}>
                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="name">Adı</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            placeholder="Adı"
                                            {...getFieldProps('name')}
                                            error={Boolean(touched.name && errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="surname">Soyadı</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="surname"
                                            placeholder="Soyadı"
                                            {...getFieldProps('surname')}
                                            error={Boolean(touched.surname && errors.surname)}
                                            helperText={touched.surname && errors.surname}
                                        />
                                    </Grid>
                                    <Grid marginBottom={3} item xs={12}>
                                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="telephone">Telefon</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="telephone"
                                            placeholder="Telefon"
                                            {...getFieldProps('telephone')}
                                            error={Boolean(touched.telephone && errors.telephone)}
                                            helperText={touched.telephone && errors.telephone}
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


