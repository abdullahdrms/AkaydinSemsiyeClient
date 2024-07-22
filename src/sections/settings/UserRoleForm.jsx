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
import { GetRoles } from 'services/roleServices';
import Loader from 'components/Loader';
import { UserRoleAsign } from 'services/userServices';


const getInitialValues = () => {
    const newPriceDate = {
        role: 0,
    };
    return newPriceDate;
};

export default function UserRoleForm({ closeModal, setIsEdit, customerId }) {
    const params = useParams();
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const validationSchema = Yup.object({
        // amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        // paymentType: Yup.string().max(255).required('Lütfen ödemenin alındığı kasa hesabını seçiniz..')
        role: Yup.number().min(1, 'required')
    });


    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append("RoleId", formik.values.role)
                fd.append("UserId", customerId)
                await UserRoleAsign(fd).then((res) => {
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
                            message: 'role başarıyla güncellendi!',
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
                console.log(values);
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    useEffect(() => {
        GetRoles().then((res) => {
            setData(res?.data)
            setLoading(false)
        })
    }, [])


    const { handleChange, handleSubmit, isSubmitting, getFieldProps, touched, errors, setFieldValue } = formik;
    if (loading) return (<Loader open={loading} />)

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
                                    <RadioGroup id='role' {...getFieldProps('role')} onChange={(e) => setFieldValue('role', parseInt(e.target.value))} name="radio-buttons-group" row>
                                        <Grid container spacing={2.5} sx={12}>

                                            {
                                                data?.map((item, i) => {
                                                    return (
                                                        <Grid key={i} item lg={3} sx={12}>
                                                            <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                                                <FormControlLabel value={item?.id} control={<Radio />} label={item?.name} />
                                                            </Box>
                                                        </Grid>
                                                    )
                                                })
                                            }
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


