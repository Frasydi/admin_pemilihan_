import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types"
// eslint-disable-next-line react/prop-types
function CardData({label, data, color, image}) {
    return (
        <Card sx={{ position: "relative", overflow: "visible" }}>
            <CardContent>
                <Box sx={{
                    backgroundColor: color, width: 100, height: 100, position: "absolute",
                    top: -30, left: "50%", transform: "translateX(-50%)", objectFit: "contain",
                    borderRadius: "1rem"
                }}>
                    <img src={image} style={{ borderRadius:"1rem",width: "100%", height: "100%" }} />
                </Box>
                <Typography variant="h6" align="center" mt={8}>
                    {label}
                </Typography>
                <Typography variant="h6" align="center">
                    {data}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default function Statistik({kandidat, pemilih, tim}) {

    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <CardData label="Jumlah Kandidat" data={kandidat+ " orang"} image="/kandidat.png" color="#FD7F2C" />
            </Grid>
            <Grid item xs={4}>
                <CardData label="Jumlah Pemilih" data={pemilih + " orang"} image="/pemilih.jpeg" color={"#00acdf"}  />
            </Grid>
            <Grid item xs={4}>
                <CardData label="Jumlah Tim" data={tim} image="/pemilih.jpeg" color={"#00acdf"}  />
            </Grid>
        </Grid>
    )
}
Statistik.propTypes = {
    kandidat : PropTypes.number,
    pemilih : PropTypes.number,
    tim : PropTypes.number,
}