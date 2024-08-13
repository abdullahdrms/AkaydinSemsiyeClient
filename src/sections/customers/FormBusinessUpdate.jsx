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
import { AddCustomer, GetCustomerDetail, UpdateCustomer } from 'services/customersServices';

// CONSTANT
const getInitialValues = (data) => {
  const newOrder = {
    customerType: 2,
    name: data?.firstName || '',
    surname: data?.lastName || '',
    phone: data?.phone || '',
    email: data?.email || '',
    customerNote: data?.customerNote || '',
    companyName: data?.companyName || '',
    taxOffice: data?.taxAdmin || '',
    taxNo: data?.taxNumber || ''
  };
  return newOrder;
};

export default function FormBusinessUpdate() {
  const navigate = useNavigate();
  const params = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);

  const VillaSchema = Yup.object().shape({
    name: Yup.string().max(255).required('İsim zorunlu..'),
    surname: Yup.string().max(255).required('Soyisim zorunlu..'),
    phone: Yup.string().max(255).required('Telefon numarası zorunlu..'),
    email: Yup.string().email("Lütfen geçerli email adresi giriniz").matches(/^(?!.*@[^,]*,)/).required("Email zorunlu"),
    companyName: Yup.string().max(255).required('Firma adı zorunlu'),
    taxOffice: Yup.string().max(255).required('Vergi dairesi zorunlu'),
    taxNo: Yup.string().max(255).required('Vergi numarası zorunlu')
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
        fd.append("CustomerType", 2)
        fd.append("Id", data?.id)

        await UpdateCustomer(fd).then((res) => {
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
              message: 'Bayi başarıyla güncellendi!',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
            navigate(`/customers/detail/${res?.data?.id}`)
          }
        })
      } catch (error) {
        // console.error(error);
      }
    }
  });

  useEffect(() => {
    GetCustomerDetail(params?.id).then((res) => {
      if (res?.data?.customerType === 2) {
        setData(res?.data)
        setLoading(false);
      } else {
        navigate("/404")
      }
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