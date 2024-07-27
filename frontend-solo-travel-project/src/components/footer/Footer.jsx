import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';

function SiteFooter() {
    return (
        <Container maxWidth="false" sx={{ mt: 3, mb: 4 }} direction="column">
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    <Typography sx={{mr: 1}}>© 2024 Group 2, Inc. Follow us on 
                    </Typography>
                    <GitHubIcon />
                    <Typography sx={{ml: 5}}>
                        <a href="https://github.com/Nemo-LH">Lucas Henry</a>
                    </Typography>
                    <Typography sx={{ml: 5, mr: 5}}>
                        <a href="https://github.com/SamB219">Sam Biamonte</a>
                    </Typography>
                    <Typography>
                        <a href="https://github.com/Claydough16">Clayton Nicholson</a>
                    </Typography>
                </Paper>
            </Grid>
        </Container>
    )
}

export default SiteFooter