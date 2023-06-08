import { Box, Grid, Typography } from "@mui/material";
import DPTLists from "./DPTLists";

export default function DPTData() {
    return(
        <Box>
            <Grid container spacing={2} direction={"column"}>
                <Grid item>
                    <Typography variant="h4">
                        Data DPT                
                    </Typography>
                </Grid>

                <Grid item>
                    <DPTLists/>
                </Grid>
            </Grid>
        </Box>
    )
}