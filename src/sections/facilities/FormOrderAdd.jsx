import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { Box, Chip, Grid, Stack, Button, Switch, Divider, TextField, InputLabel, Typography, Autocomplete, DialogContent, DialogActions, FormControlLabel, FormControl, FormGroup, Checkbox, RadioGroup, Radio, Link } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import { useNavigate } from 'react-router';

// assets
import 'react-quill/dist/quill.snow.css';
import MainCard from 'components/MainCard';
import { GetAllCustomer } from 'services/customersServices';
import Loader from 'components/Loader';
import { GetCustomerAdress } from 'services/customersAdressServices';
import { CreateOrder } from 'services/ordersServices';
import { calculateBusinessDays, calculateDaysBetweenDates, formatDate } from 'utils/custom/dateHelpers';

// CONSTANT
const getInitialValues = () => {
  const newOrder = {
    customer: 0,
    orderNo: 0,
    deliveryLocation: 0,
    deliveryAdressId: 0,
    deliveryType: 0,
    deadline: 0,
    orderNote: '',
    deliveryDescription: '',
  };
  return newOrder;
};

export default function FormOrderAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerAddress, setCustomerAdress] = useState([]);
  const [deadlineDate, setDeadlineDate] = useState(new Date())

  useEffect(() => {
    GetAllCustomer().then((res) => { setCustomers(res?.data) })
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      const removeDuplicates = () => {
        const uniquePeople = customers.filter((person, index, self) =>
          index === self.findIndex((p) => p.firstName === person.firstName)
        );
        setCustomers(uniquePeople);
        setLoading(false);
      };
      removeDuplicates()
    }
  }, [customers])



  const VillaSchema = Yup.object().shape({
    customer: Yup.number().moreThan(0, 'Bu alan zorunlu'),
    orderNo: Yup.number().moreThan(0, `Bu alan zorunlu ve 0'dan büyük olmalı`),
    deliveryLocation: Yup.number().moreThan(0, `Bu alan zorunlu`),
    deliveryAdressId: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
      if (parseInt(formik.values.deliveryLocation) === 1) {
        if (value < 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }),
    deliveryType: Yup.number().test("isValid", "Bu alan zorunlu", (value) => {
      if (parseInt(formik.values.deliveryLocation) === 1) {
        if (value < 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }),
    deadline: Yup.number().moreThan(0, "Bu alan zorunlu")
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: VillaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true)
        const fd = new FormData()

        if (parseInt(formik.values.deliveryLocation) === 1) {
          fd.append('DeliveryLocationText', formik.values.deliveryDescription)
          fd.append('DeliveryType', formik.values.deliveryType)
          fd.append('CustomerAddressId', formik.values.deliveryAdressId)
        }
        if (formik.values.deadline) {
          if (parseInt(formik.values.deadline) === 1) {
            fd.append('Deadline', formatDate(calculateBusinessDays(7)))
          } else if (parseInt(formik.values.deadline) === 2) {
            fd.append('Deadline', formatDate(calculateBusinessDays(14)))
          } else if (parseInt(formik.values.deadline) === 3) {
            fd.append('Deadline', formatDate(deadlineDate))
          }
        }
        fd.append('OrderNumber', formik.values.orderNo)
        fd.append('OrderNote', formik.values.orderNote)
        fd.append('OrderStatusType', 1)
        fd.append('DeliveryLocation', formik.values.deliveryLocation)
        fd.append('CustomerId', formik.values.customer)

        await CreateOrder(fd).then((res) => {
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
            navigate(`/orders/detail/${res?.data?.id}`)
          }
          setSubmitting(false)
        })

        // console.log(values);
      } catch (error) {
        // console.error(error);
      }
    }
  });

  useEffect(() => {
    if (formik?.values?.customer !== '') {
      GetCustomerAdress(formik?.values?.customer).then((res) => {
        setCustomerAdress(res?.data)
      })
    }
  }, [formik?.values?.customer])


  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  if (loading) return <Loader open={loading} />


  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>

                  <Grid item xs={12}>
                    <MainCard title='Müşteri İşlemleri'>
                      <Grid item marginBottom={3} xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Müşteri Seçimi</InputLabel>
                        <Autocomplete
                          disableClearable
                          fullWidth
                          id="basic-autocomplete-label"
                          options={customers}
                          getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                          isOptionEqualToValue={(option, value) => option?.id === value?.id}
                          onChange={(e, value) => setFieldValue('customer', value?.id)}
                          renderInput={(params) => <TextField {...params} helperText={errors.customer} error={Boolean(errors.customer)} label="Lütfen Müşteri Seçiniz" />}
                        />
                      </Grid>
                      <Grid item marginBottom={3} xs={12}>
                        <Link sx={[{
                          '&:hover': {
                            color: "#009ef7",
                            transition: 'color .2s ease'
                          },
                        }]} underline='none' href={`/customers/add`}>
                          Müşteri Ekle
                        </Link>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Sipariş İşlemleri'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }} htmlFor="villa-person">Sipariş Numarası</InputLabel>
                        <TextField
                          fullWidth
                          id="orderNo"
                          placeholder="Sipariş Numarası"
                          {...getFieldProps('orderNo')}
                          error={Boolean(touched.orderNo && errors.orderNo)}
                          helperText={touched.orderNo && errors.orderNo}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Sipariş Notları</InputLabel>
                        <TextField
                          fullWidth
                          id="orderNote"
                          multiline
                          rows={5}
                          placeholder="Sipariş Notları"
                          {...getFieldProps('orderNote')}
                          error={Boolean(touched.orderNote && errors.orderNote)}
                          helperText={touched.orderNote && errors.orderNote}
                        />
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Teslim İşlemleri'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Teslim Yeri Seçimi</InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deliveryLocation' name="radio-deliveryLocation" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('deliveryLocation', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deliveryLocation ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.deliveryLocation === "1" ? true : false} onChange={(e) => setFieldValue('deliveryLocation', "1")} name='radio-deliveryLocation' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      Adres
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('deliveryLocation', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deliveryLocation ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.deliveryLocation === "2" ? true : false} onChange={(e) => setFieldValue('deliveryLocation', "2")} name='radio-deliveryLocation' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      Depo
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                          {
                            errors?.deliveryLocation &&
                            <>
                              <div style={{ color: 'red', marginTop: '1rem' }}>
                                {errors?.deliveryLocation}
                              </div>
                            </>
                          }
                        </FormControl>
                      </Grid>
                      {
                        parseInt(formik.values.deliveryLocation) === 1 &&
                        <>
                          <Grid marginBottom={3} item xs={12}>
                            <InputLabel sx={{ marginBottom: 2 }}>Teslim Yeri Adres Seçimi</InputLabel>
                            <Autocomplete
                              fullWidth
                              id="basic-autocomplete-label"
                              disableClearable
                              disabled={customerAddress ? customerAddress?.length < 1 : false}
                              options={customerAddress}
                              getOptionLabel={(option) => `${option?.title}`}
                              isOptionEqualToValue={(option, value) => option?.id === value?.id}
                              onChange={(e, value) => setFieldValue('deliveryAdressId', value?.id)}
                              renderInput={(params) => <TextField {...params} helperText={errors.deliveryAdressId} error={Boolean(errors.deliveryAdressId)} label="Lütfen Müşteri Adresi Seçiniz" />}
                            />
                          </Grid>

                          <Grid marginBottom={3} item xs={12}>
                            <InputLabel sx={{ marginBottom: 2 }}>Teslim Türü Seçimi</InputLabel>
                            <FormControl style={{ width: '100%' }} component="fieldset">
                              <RadioGroup id='deliveryType' name="radio-deliveryType" row>
                                <Grid container spacing={3}>
                                  <Grid item lg={3} xs={12}>
                                    <Box onClick={() => setFieldValue('deliveryType', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deliveryType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                      <label htmlFor="">
                                        <span>
                                          <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.deliveryType === "1" ? true : false} onChange={(e) => setFieldValue('deliveryType', "1")} name='radio-deliveryType' type="radio" />
                                        </span>
                                        <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                          Kargo
                                        </span>
                                      </label>
                                    </Box>
                                  </Grid>
                                  <Grid item lg={3} xs={12}>
                                    <Box onClick={() => setFieldValue('deliveryType', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deliveryType ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                      <label htmlFor="">
                                        <span>
                                          <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.deliveryType === "2" ? true : false} onChange={(e) => setFieldValue('deliveryType', "2")} name='radio-deliveryType' type="radio" />
                                        </span>
                                        <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                          Servis
                                        </span>
                                      </label>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </RadioGroup>
                              {
                                errors?.deliveryType &&
                                <>
                                  <div style={{ color: 'red', marginTop: '1rem' }}>
                                    {errors?.deliveryType}
                                  </div>
                                </>
                              }
                            </FormControl>
                          </Grid>

                          <Grid marginBottom={3} item xs={12}>
                            <InputLabel sx={{ marginBottom: 2 }} htmlFor="deliveryDescription">Teslim Yeri Notları</InputLabel>
                            <TextField
                              fullWidth
                              id="deliveryDescription"
                              multiline
                              rows={5}
                              placeholder="Teslim yeri için notlar ekleyebilirsiniz."
                              {...getFieldProps('deliveryDescription')}
                              error={Boolean(touched.deliveryDescription && errors.deliveryDescription)}
                              helperText={touched.deliveryDescription && errors.deliveryDescription}
                            />
                          </Grid>
                        </>
                      }
                    </MainCard>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard title='Termin İşlemleri'>
                      <Grid marginBottom={3} item xs={12}>
                        <InputLabel sx={{ marginBottom: 2 }}>Termin Tarihi Seçimi</InputLabel>
                        <FormControl style={{ width: '100%' }} component="fieldset">
                          <RadioGroup id='deadline' name="radio-deadline" row>
                            <Grid container spacing={3}>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('deadline', "1")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deadline ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="1" checked={formik.values.deadline === "1" ? true : false} onChange={(e) => setFieldValue('deadline', "1")} name='radio-deadline' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      7 İş Günü
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('deadline', "2")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deadline ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="2" checked={formik.values.deadline === "2" ? true : false} onChange={(e) => setFieldValue('deadline', "2")} name='radio-deadline' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      14 İş Günü
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <Box onClick={() => setFieldValue('deadline', "3")} component="section" sx={{ p: 2, pl: 2, width: '100%', cursor: 'pointer', borderRadius: 1, border: `1px dashed ${errors.deadline ? '#dc2626' : 'grey'}`, '&:hover': { bgcolor: '#f1faff', borderColor: '#009ef7' } }}>
                                  <label htmlFor="">
                                    <span>
                                      <input style={{ width: '20px', height: '20px' }} value="3" checked={formik.values.deadline === "3" ? true : false} onChange={(e) => setFieldValue('deadline', "3")} name='radio-deadline' type="radio" />
                                    </span>
                                    <span style={{ position: 'relative', bottom: '4px', left: '6px' }}>
                                      Özel
                                    </span>
                                  </label>
                                </Box>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                          {
                            errors?.deadline &&
                            <>
                              <div style={{ color: 'red', marginTop: '1rem' }}>
                                {errors?.deadline}
                              </div>
                            </>
                          }
                        </FormControl>
                      </Grid>

                      {
                        parseInt(formik.values.deadline) === 3 &&
                        <Grid marginBottom={3} item xs={12}>
                          <InputLabel sx={{ marginBottom: 2 }}>Termin Tarihi</InputLabel>
                          <DesktopDatePicker
                            label=""
                            inputFormat="MM/dd/yyyy"
                            minDate={new Date()}
                            value={deadlineDate}
                            onChange={setDeadlineDate}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>
                      }
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