import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { Box, Chip, Grid, Stack, Button, Switch, Divider, TextField, InputLabel, Typography, Autocomplete, DialogContent, DialogActions, FormControlLabel, FormControl, FormGroup, Checkbox, RadioGroup, Radio, Input } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import { useLocation, useNavigate, useParams } from 'react-router';

// assets
import { CloseCircle } from 'iconsax-react';
import 'react-quill/dist/quill.snow.css';
import MainCard from 'components/MainCard';

// CONSTANT
const getInitialValues = () => {
  const newOrder = {
    shape: 0,
    measure: 0,
    flue: 0,
    customer: '',
    orderNo: 0,
    deliveryLocation: 0,
    deliveryType: 0,
    deadline: '0',
    orderNote: '',
    deliveryDescription: '',
  };
  return newOrder;
};

export default function FormProductCreate() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deadlineDate, setDeadlineDate] = useState(new Date())

  const orderId = location.pathname.replace('/orders/detail/create-product/', '').split('/')[0]

  useEffect(() => {
    setLoading(false);
    console.log('orderId:', orderId, 'productId:', params.id);
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
                    <MainCard title='Şekil Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='shape' {...getFieldProps('shape')} onChange={(e) => setFieldValue('shape', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Kare" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Dikdörtgen" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="3" control={<Radio />} label="Yuvarlak" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="4" control={<Radio />} label="Özel" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Ölçü Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='measure' {...getFieldProps('measure')} onChange={(e) => setFieldValue('measure', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="300 x 300" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="350 x 350" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="3" control={<Radio />} label="400 x 400" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="4" control={<Radio />} label="450 x 450" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="5" control={<Radio />} label="500 x 500" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="6" control={<Radio />} label="550 x 550" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="7" control={<Radio />} label="600 x 600" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Baca Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='flue' {...getFieldProps('flue')} onChange={(e) => setFieldValue('flue', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Bacalı" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="3" control={<Radio />} label="Havalandırmalı" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='İskelet Renk Seçimi'>
                      <Grid spacing={3} container xs={12}>
                        <Grid item marginBottom={3} xs={12} lg={8}>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id="basic-autocomplete-label"
                            options={['RAL-1000', 'RAL-1001']}
                            renderInput={(params) => <TextField {...params} label="İskelet Renk Seçimi" />}
                          />
                        </Grid>
                        <Grid item xs={12} lg={4} >
                          <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', height: '258px', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                          </Box>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Kumaş Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Akrilik" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Yerli" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="3" control={<Radio />} label="Özel" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Kumaş Renk Seçimi'>
                      <Grid spacing={3} container xs={12}>
                        <Grid item marginBottom={3} xs={12} lg={8}>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id="basic-autocomplete-label"
                            options={['RAL-1000', 'RAL-1001']}
                            renderInput={(params) => <TextField {...params} label="Kumaş Renk Seçimi" />}
                          />
                        </Grid>
                        <Grid item xs={12} lg={4} >
                          <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', height: '258px', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                          </Box>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Ayak Seçimi'>
                      <Grid item marginBottom={3} xs={12} >
                        <Autocomplete
                          fullWidth
                          disablePortal
                          id="basic-autocomplete-label"
                          options={['RAL-1000', 'RAL-1001']}
                          renderInput={(params) => <TextField {...params} label="Ayak Seçimi" />}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Kaide Kapağı Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Saçak Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Baskı Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Baskı Köşe Sayısı Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="1" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="2" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="3" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="4" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Saçak Baskı Yazısı'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Saçak Baskı Yazısı"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Cırt Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Cırt Köşe Sayısı Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="1" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="2" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="3" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="4" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Cırt Notları'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Saçak Cırt Notları Yazınız"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Saçak Biye Renk Notları'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Saçak Biye Renk Notları Yazınız"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Led Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Led Adet'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="orderNo"
                          type='number'
                          placeholder="Led adet"
                          {...getFieldProps('orderNo')}
                          error={Boolean(touched.orderNo && errors.orderNo)}
                          helperText={touched.orderNo && errors.orderNo}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Led Türü'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="12 Volt Adaptörlü" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Güneş Enerjili" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Özel" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Led Türü Açıklaması"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Isıtıcı Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Isıtıcı Adet'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="orderNo"
                          type='number'
                          placeholder="Isıtıcı adet"
                          {...getFieldProps('orderNo')}
                          error={Boolean(touched.orderNo && errors.orderNo)}
                          helperText={touched.orderNo && errors.orderNo}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Isıtıcı Notları'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Isıtıcı Notları"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Elektrik Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Elektrik Notları'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Elektrik Notları"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Motor Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Yok" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Var" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Motor Türü Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="Güneş Enerjili" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Şebeke Enerjili" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="Özel" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Motor Türü Notları'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Motor Türü Notları"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Sipariş Adeti'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="orderNo"
                          type='number'
                          placeholder="Sipariş Adeti"
                          {...getFieldProps('orderNo')}
                          error={Boolean(touched.orderNo && errors.orderNo)}
                          helperText={touched.orderNo && errors.orderNo}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Sipariş Tutarı'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="orderNo"
                          type='number'
                          placeholder="Sipariş Tutarı"
                          {...getFieldProps('orderNo')}
                          error={Boolean(touched.orderNo && errors.orderNo)}
                          helperText={touched.orderNo && errors.orderNo}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Kdv Oranı Seçimi'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' {...getFieldProps('deliveryLocation')} onChange={(e) => setFieldValue('deliveryLocation', parseInt(e.target.value))} name="radio-buttons-group" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', marginRight: 3, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="1" control={<Radio />} label="%18" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="%8" />
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box component="section" sx={{ p: 1.5, pl: 3, width: '100%', cursor: 'pointer', borderRadius: 1, border: '1px dashed grey', '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <FormControlLabel value="2" control={<Radio />} label="%0" />
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Ürün Notları'>
                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}></InputLabel>
                        <TextField
                          fullWidth
                          id="descriptionShort"
                          multiline
                          rows={5}
                          placeholder="Ürün Notları"
                          {...getFieldProps('descriptionShort')}
                          error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                          helperText={touched.descriptionShort && errors.descriptionShort}
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