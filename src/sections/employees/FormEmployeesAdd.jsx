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
import { useNavigate } from 'react-router';

// assets
import { CloseCircle } from 'iconsax-react';
import MainCard from 'components/MainCard';

// CONSTANT
const getInitialValues = () => {
  const newOrder = {
    departments: '',
    name: '',
    surname: '',
    phone: '',
    email: '',
    adressTitle: '',
    province: '',
    district: '',
    openAddress: '',
  };
  return newOrder;
};

export default function FormEmployeesAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const VillaSchema = Yup.object().shape({
    // name: Yup.string().max(255).required('Lütfen villa adı yazınız..'),
    // room: Yup.number().moreThan(0, "Oda sayısı 0'dan büyük olmalıdır").required('Oda Sayısı zorunludur'),
    // bath: Yup.number().moreThan(0, "Banyo sayısı 0'dan büyük olmalıdır").required('Banyo Sayısı zorunludur'),
    // categories: Yup.array().of(Yup.string()).min(1, 'En az bir adet kategori zorunludur.').required('En az bir adet kategori zorunludur.'),
    // person: Yup.number().moreThan(0, "Kişi sayısı 0'dan büyük olmalıdır").required('Kişi Sayısı zorunludur'),
    // region: Yup.string().max(255).required('Lütfen bölge yazınız..'),
    // onlineReservation: Yup.boolean().required('Rezervasyon seçeneği zorunludur')
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: VillaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(values);
      } catch (error) {
        // console.error(error);
      }
    }
  });

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
                    <MainCard title='Personel Bilgileri'>

                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Departman</InputLabel>
                        <Autocomplete
                          fullWidth
                          disablePortal
                          id="basic-autocomplete-label"
                          options={['Yönetim', 'Muhasebe']}
                          renderInput={(params) => <TextField {...params} label="Departman" />}
                        />
                      </Grid>
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