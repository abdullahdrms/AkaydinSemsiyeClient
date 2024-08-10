// material-ui
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// project imports
import ContactForm from 'sections/extra-pages/contact/ContactForm';
import ContactHeader from 'sections/extra-pages/contact/ContactHeader';
import MonthlyStatsTable from 'sections/stats/monthly-stats-table';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function MonthlyStat() {
    return (
        <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
            <Grid item xs={12} md={12}>
                <MonthlyStatsTable />
            </Grid>
        </Grid>
    );
}
