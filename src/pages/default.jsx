// material-ui
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// project imports
import ContactForm from 'sections/extra-pages/contact/ContactForm';
import ContactHeader from 'sections/extra-pages/contact/ContactHeader';
import DeadlineList from 'sections/default/deadline-list';
import MainCard from 'components/MainCard';
import { Box, Stack, Typography } from '@mui/material';
import { Apple, ArrowDown2, Bag2, Calendar, Chart, DocumentDownload, DocumentText, Dribbble, Facebook, People, Shop, ShoppingCart, User, Youtube } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import IncomeAreaChart from 'sections/default/IncomeChart';
import ProductOverview from 'sections/default/ProductOverview';
import TotalIncome from 'sections/default/TotalIncome';
import HoverSocialCard from 'sections/default/HoverSocialCard';
import ReportCard from 'sections/default/ReportCard';
import { useEffect, useState } from 'react';
import { getBestProductMonthCount, getBestProductYearCount, getGlobalCount, getYearOrderCount } from 'services/statServices';
import { GetListDeadline } from 'services/ordersServices';
import Loader from 'components/Loader';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function Default() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(() => []);
  const [globalCount, setGlobalCount] = useState([])
  const [yearOrderCount, setYearOrderCount] = useState([])
  const [bestProductYearCount, setBestProductYearCount] = useState([])
  const [bestProductMonthCount, setBestProductMonthCount] = useState([])

  useEffect(() => {
    async function fetchData() {
      await getGlobalCount().then((res) => {
        setGlobalCount(res?.data[0])
      })
      await getYearOrderCount().then((res) => {
        setYearOrderCount(res?.data)
      })
      await getBestProductYearCount().then((res) => {
        setBestProductYearCount(res?.data)
      })
      await getBestProductMonthCount().then((res) => {
        setBestProductMonthCount(res?.data)
      })
      await GetListDeadline().then((res) => {
        setData(res)
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <Loader open={loading} />

  return (
    <>
      <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={12}>
          <DeadlineList data={data} setData={setData} />
        </Grid>
      </Grid>
      <Grid marginTop={6} marginBottom={6} container spacing={3}>
        {/* <Grid item xs={12} md={4} lg={3} sm={6}>
          <ReportCard primary="$30200" secondary="All Earnings" color={'rgb(91, 107, 121)'} iconPrimary={Chart} />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sm={6}>
          <ReportCard primary="145" secondary="Task" color={'rgb(220, 38, 38)'} iconPrimary={Calendar} />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sm={6}>
          <ReportCard primary="290+" secondary="Page Views" color={'rgb(44, 168, 127)'} iconPrimary={DocumentText} />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sm={6}>
          <ReportCard primary="500" secondary="Downloads" color={'rgb(70, 128, 255)'} iconPrimary={DocumentDownload} />
        </Grid> */}

        <Grid item xs={12} md={4} lg={3} sm={6}>
          <HoverSocialCard primary="Toplam Sipariş" secondary={globalCount?.orderCount} iconPrimary={ShoppingCart} color={'#4680FF'} />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sm={6}>
          <HoverSocialCard primary="Toplam Ürün" secondary={globalCount?.orderDetailCount} iconPrimary={Bag2} color={'#3ec9d6'} />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sm={6}>
          <HoverSocialCard
            primary="Toplam Bayi"
            secondary={globalCount?.dealerCount}
            iconPrimary={Shop}
            color={'#3E4853'}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sm={6}>
          <HoverSocialCard primary="Toplam Müşteri" secondary={globalCount?.customerCount} iconPrimary={User} color={'#dc2626'} />
        </Grid>
      </Grid>
      <Grid marginBottom={6} item xs={12}>
        <MainCard>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Stack alignItems={{ xs: 'center', sm: 'flex-start' }}>
                <Typography variant="h5">Yıllık Satış</Typography>
                {/* <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
                  <ArrowDown2 variant="Bold" style={{ color: 'red', paddingRight: '4px' }} />
                  <Typography color={'red'}>$1,12,900 (45.67%)</Typography>
                </Stack> */}
                {/* <Typography color="text.secondary" sx={{ display: 'block' }}>
                  Compare to : 01 Dec 2021-08 Jan 2022
                </Typography> */}
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ pt: 1 }}>
            <IncomeAreaChart yearOrderCount={yearOrderCount} />
          </Box>
        </MainCard>
      </Grid>

      <Grid item xs={12} display={'flex'} gap={3}>
        <Grid item xs={12} lg={6}>
          {/* <TotalIncome bestProductYearCount={bestProductYearCount} /> */}
          <ProductOverview bestProductMonthCount={bestProductYearCount} label='En çok satılan ürün' />
        </Grid>
      </Grid>

      <Grid item marginBottom={6} marginTop={6} xs={12} lg={12}>
        <ProductOverview label='Aylık en çok satılan ürün' bestProductMonthCount={bestProductMonthCount} />
      </Grid>
    </>
  );
}
