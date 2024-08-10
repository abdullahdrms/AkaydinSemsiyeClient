// material-ui
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// project imports
import ContactForm from 'sections/extra-pages/contact/ContactForm';
import ContactHeader from 'sections/extra-pages/contact/ContactHeader';
import YearlyStatsTable from 'sections/stats/yearly-stats-table';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function YearlyStats() {
    return (
        <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
            <Grid item xs={12} md={12}>
                <YearlyStatsTable />
            </Grid>
        </Grid>
    );
}
