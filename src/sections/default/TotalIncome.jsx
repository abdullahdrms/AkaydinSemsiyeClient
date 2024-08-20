import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import IconButton from 'components/@extended/IconButton';
import { ThemeMode } from 'config';

// assets
import { ArrowUp } from 'iconsax-react';

// chart options
const pieChartOptions = {
  chart: {
    type: 'donut',
    height: 320
  },
  labels: ['Klasik Şemsiye', 'Kamelya', 'Mekanizmalı Lüks Şemsiye', 'Mekanizmalı Ekonomik Şemsiye', 'Yandan Gövdeli Şemsiye', 'Yedek Parça ve Servis', 'Ahşap Şemsiye', 'Plaj Şemsiyesi'],
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  }
};

// ==============================|| CHART ||============================== //

function ApexDonutChart({ bestProductYearCount }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const mode = theme.palette.mode;

  const { primary } = theme.palette.text;
  const line = theme.palette.divider;
  const grey200 = theme.palette.secondary[200];
  const backColor = theme.palette.background.paper;

  const [series, setSeries] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [options, setOptions] = useState(pieChartOptions);

  useEffect(() => {
    setSeries(bestProductYearCount.map((item) => parseInt(item?.count)))
  }, [bestProductYearCount])


  useEffect(() => {
    const primaryMain = theme.palette.primary.main;
    const primaryLighter = theme.palette.primary[100];
    const warning = theme.palette.warning.main;
    const success = theme.palette.success.main;
    const info = theme.palette.info.main;
    const grn = '#0fd66c'
    const prp = '#434c8a'
    const yel = '#98a118'

    setOptions((prevState) => ({
      ...prevState,
      colors: [primaryMain, primaryLighter, warning, success, info, grn, prp,yel],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      stroke: {
        colors: [backColor]
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, line, grey200, backColor, theme]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="donut" height={downSM ? 280 : 320} />
    </div>
  );
}

// ==============================|| CHART WIDGETS - TOTAL INCOME ||============================== //

export default function TotalIncome({ bestProductYearCount }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">En çok satılan ürün</Typography>
            {/* <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreIcon />
            </IconButton> */}
            <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'wallet-button', sx: { p: 1.25, minWidth: 150 } }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ApexDonutChart bestProductYearCount={bestProductYearCount} />
        </Grid>
        <Grid container item justifyContent={'center'} display={'flex'} alignItems={'center'} spacing={3} xs={12} sm={6}>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv />
                  <Typography>Klasik Şemsiye</Typography>
                </Stack>

                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '1')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv sx={{ bgcolor: 'primary.200' }} />
                  <Typography>Kamelya</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '2')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv color="warning" />
                  <Typography>Mekanizmalı Lüks Şemsiye</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '3')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv color="success" />
                  <Typography>Mekanizmalı Ekonomik Şemsiye</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '4')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv color="info" />
                  <Typography>Yandan Gövdeli Şemsiye</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '5')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot sx={{ bgcolor: '#0fd66c' }} componentDiv />
                  <Typography>Yedek Parça ve Servis</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '6')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv sx={{ bgcolor: '#434c8a' }} />
                  <Typography>Ahşap Şemsiye</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '7')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
              <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot componentDiv sx={{ bgcolor: '#98a118' }} />
                  <Typography>Plaj Şemsiyesi</Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {bestProductYearCount.find((item) => item?.productName === '8')?.count}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>

      </Grid>
    </MainCard>
  );
}
