/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Autocomplete, Box } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';

// project imports
import { useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';


const getInitialValues = () => {
    const newPriceDate = {
        password: '',
        rePassword: ''
    };
    return newPriceDate;
};

export default function RoleForm({ closeModal, setIsEdit, customerId }) {
    const params = useParams();
    const validationSchema = Yup.object({
        // amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        // paymentType: Yup.string().max(255).required('Lütfen ödemenin alındığı kasa hesabını seçiniz..')
    });


    const formik = useFormik({
        initialValues: getInitialValues(),
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

    const { handleChange, handleSubmit, isSubmitting, getFieldProps, touched, errors } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Yetki Seçimi</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>

                            <Grid marginBottom={3} item xs={12}>
                                <FormControl style={{ width: '100%' }} component="fieldset">
                                    <RadioGroup id='deadline' {...getFieldProps('deadline')} onChange={(e) => setFieldValue('deadline', parseInt(e.target.value))} name="radio-buttons-group" row>
                                        <Grid container spacing={2.5} sx={12}>


                                            <Grid item lg={3} sx={12}>
                                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                    <FormControlLabel value="1" control={<Radio />} label="Super Admin" />
                                                </Box>
                                            </Grid>




                                            <Grid item lg={3} sx={12}>
                                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                    <FormControlLabel value="2" control={<Radio />} label="Admin" />
                                                </Box>
                                            </Grid>



                                            <Grid item lg={3} sx={12}>
                                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                    <FormControlLabel value="3" control={<Radio />} label="Bayi" />
                                                </Box>
                                            </Grid>



                                            <Grid item lg={3} sx={12}>
                                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                    <FormControlLabel value="4" control={<Radio />} label="Personel" />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </RadioGroup>
                                </FormControl>
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


