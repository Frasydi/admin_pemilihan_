import useAuth from "../../hooks/useAuth";
import { Box, CircularProgress, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import Sidebar from "../Sidebar";
import PropTypes from "prop-types"
import NavBar from "../Navbar";

const theme = createTheme({
    typography: {
        fontFamily: "Merriweather"
    },
})

export default function Guard({ children }) {
    const auth = useAuth()
    if (auth.loading && auth.user == null) {
        return (
            <Box height={"100vh"}>
                <Grid container alignItems={"center"} justifyContent={"center"} direction={"column"} height={"100%"}>
                    <Grid item>
                        <Typography>Loading...</Typography>
                    </Grid>
                    <Grid item>

                        <CircularProgress />
                    </Grid>
                </Grid>
            </Box>
        )
    }
    if (auth.user == null) {
        return (
            <>
                {children}
            </>
        )
    }
    return (
        <>
            <Grid container sx={{ position: "sticky", top: 0, left: 0, zIndex : 500 }}>
                <Grid item xs={1}>
                    <Sidebar />
                </Grid>
                <Grid item xs={11}>
                    <NavBar />
                </Grid>
            </Grid>
            <Box marginX={14} marginTop={5} minHeight={"70vh"} sx={{zIndex:-10}}>
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
            </Box>
        </>
    )
}

Guard.propTypes = {
    children: PropTypes.node.isRequired
}