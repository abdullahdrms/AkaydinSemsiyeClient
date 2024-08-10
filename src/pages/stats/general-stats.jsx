// material-ui
import Grid from '@mui/material/Grid';

// project imports
import GeneralStatsTable from 'sections/stats/general-stats-table';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function GeneralStats() {
    return (
        <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
            <Grid item xs={12} md={12}>
                <GeneralStatsTable />
            </Grid>
        </Grid>
    );
}
