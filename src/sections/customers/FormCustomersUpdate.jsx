import { useEffect, useState } from 'react';

// material ui
import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, Autocomplete, DialogContent, DialogActions, FormControlLabel, FormControl, RadioGroup, Radio } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';

// assets
import { CloseCircle } from 'iconsax-react';
import MainCard from 'components/MainCard';
import { AddCustomer, GetCustomerDetail } from 'services/customersServices';

// CONSTANT
const getInitialValues = (data) => {
  const newOrder = {
    customerType: `${data?.customerType}` || 0,
    name: data?.firstName || '',
    surname: data?.lastName || '',
    phone: data?.phone || '',
    email: data?.email || '',
    customerNote: data?.customerNote || '',
    adressTitle: '',
    province: '',
    district: '',
    openAddress: '',
    companyName: data?.companyName || '',
    taxOffice: data?.taxAdmin || '',
    taxNo: data?.taxNumber || '',
  };
  return newOrder;
};

export default function FormCustomersAdd() {
  const navigate = useNavigate();
  const params = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);

  const VillaSchema = Yup.object().shape({
    customerType: Yup.number().moreThan(0, "Müşteri türü zorunlu."),
    name: Yup.string().max(255).required('İsim zorunlu..'),
    surname: Yup.string().max(255).required('Soyisim zorunlu..'),
    phone: Yup.string().max(255).required('Telefon numarası zorunlu..'),
    email: Yup.string().test("isValid", "Email zorunlu", (value) => {
      if (parseInt(formik.values.customerType) === 2) {
        if (formik.values.email !== "") {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }),
    companyName: Yup.string().test("isValid", "Firma adı zorunlu", (value) => {
      if (formik.values.customerType === 2 && !(value)) {
        return false
      } else {
        return true
      }
    }),
    taxOffice: Yup.string().test("isValid", "Vergi dairesi zorunlu", (value) => {
      if (formik.values.customerType === 2 && !(value)) {
        return false
      } else {
        return true
      }
    }),
    taxNo: Yup.string().test("isValid", "Vergi numarası zorunlu", (value) => {
      if (formik.values.customerType === 2 && !(value)) {
        return false
      } else {
        return true
      }
    }),
  });

  const formik = useFormik({
    initialValues: getInitialValues(data),
    validationSchema: VillaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const fd = new FormData()
        fd.append("FirstName", formik.values.name)
        fd.append("LastName", formik.values.surname)
        fd.append("Phone", formik.values.phone)
        fd.append("Email", formik.values.email)
        fd.append("CompanyName", formik.values.companyName)
        fd.append("TaxAdmin", formik.values.taxOffice)
        fd.append("TaxNumber", formik.values.taxNo)
        fd.append("CustomerNote", formik.values.customerNote)
        fd.append("CustomerType", formik.values.customerType)

        console.log(values);


        // AddCustomer(fd).then((res) => {
        //   if (res.errors || res.statusCode === 400) {
        //     openSnackbar({
        //       open: true,
        //       message: `${res.message ? res.message : 'Error'}`,
        //       variant: 'alert',
        //       alert: {
        //         color: 'error'
        //       },
        //       close: false
        //     })
        //   } else {
        //     openSnackbar({
        //       open: true,
        //       message: 'Customer başarıyla eklendi!',
        //       variant: 'alert',
        //       alert: {
        //         color: 'success'
        //       },
        //       close: false
        //     })
        //     resetForm()
        //   }
        // })
      } catch (error) {
        // console.error(error);
      }
    }
  });

  useEffect(() => {
    GetCustomerDetail(params?.id).then((res) => {
      setData(res?.data)
      setLoading(false);
    })
  }, [])

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>

                  <Grid item xs={12}>
                    <MainCard title='Müşteri Türü'>
                      <Grid item marginBottom={3} xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Müşteri Türü Seçimi</InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='customerType' name="radio-customerType" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('customerType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.customerType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.customerType === "1" ? true : false} onChange={(e) => setFieldValue('customerType', "1")} name='radio-customerType' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      Müşteri
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('customerType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.customerType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.customerType === "2" ? true : false} onChange={(e) => setFieldValue('customerType', "2")} name='radio-customerType' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      Bayi
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                          {
                            errors?.customerType &&
                            <>
                              <div style={{ color: 'red', marginTop: '1rem' }}>
                                {errors?.customerType}
                              </div>
                            </>
                          }
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Müşteri Bilgileri'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="villa-person">Adı</InputLabel>
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
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="villa-person">Soyadı</InputLabel>
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
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="villa-person">Telefon</InputLabel>
                        <TextField
                          fullWidth
                          id="phone"
                          placeholder="Telefon"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>

                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="villa-person">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="email"
                          placeholder="Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Müşteri Notları</InputLabel>
                        <TextField
                          fullWidth
                          id="customerNote"
                          multiline
                          rows={5}
                          placeholder="Müşteri Notları"
                          {...getFieldProps('customerNote')}
                          error={Boolean(touched.customerNote && errors.customerNote)}
                          helperText={touched.customerNote && errors.customerNote}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Adres Bilgileri'>
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
                          id="basic-autocomplete-label"
                          options={['İstanbul', 'Bursa']}
                          renderInput={(params) => <TextField {...params} label="İl" />}
                        />
                      </Grid>

                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>İlçe</InputLabel>
                        <Autocomplete
                          fullWidth
                          disablePortal
                          id="basic-autocomplete-label"
                          options={['Çekmeköy', 'Kadıköy']}
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
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Firma Bilgileri'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="companyName">Firma Adı</InputLabel>
                        <TextField
                          fullWidth
                          id="companyName"
                          placeholder="Firma Adı"
                          {...getFieldProps('companyName')}
                          error={Boolean(touched.companyName && errors.companyName)}
                          helperText={touched.companyName && errors.companyName}
                        />
                      </Grid>

                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="taxOffice">Vergi Dairesi</InputLabel>
                        <TextField
                          fullWidth
                          id="taxOffice"
                          placeholder="Vergi Dairesi"
                          {...getFieldProps('taxOffice')}
                          error={Boolean(touched.taxOffice && errors.taxOffice)}
                          helperText={touched.taxOffice && errors.taxOffice}
                        />
                      </Grid>

                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="taxNo">Vergi Numarası</InputLabel>
                        <TextField
                          fullWidth
                          id="taxNo"
                          placeholder="Vergi Numarası"
                          {...getFieldProps('taxNo')}
                          error={Boolean(touched.taxNo && errors.taxNo)}
                          helperText={touched.taxNo && errors.taxNo}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="end" alignItems="end">
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="end">
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      KAYDET
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
}