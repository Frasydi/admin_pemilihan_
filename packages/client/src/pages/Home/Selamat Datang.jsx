import { Card, CardContent, Grid, Typography } from "@mui/material";

export default function Selamat_Datang() {

  return (
    <Card
      elevation={4}
      sx={{
        width: "75vw",
        paddingX: "3rem",
        paddingY: "2rem",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: "url('asset 1.png')",
        position: "relative"
      }}
    >
        <div  style={{
            position: "absolute",
            top : 0,
            left : 0,
            width : '100%',
            height : "100%",
            background: "linear-gradient(to bottom, #AF0000, #3E0000)",
            opacity : 0.9,
            zIndex : 1
        }}/>
        <img src={"/asset 3a.png"} style={{width : 70, height : 100,aspectRatio:"1/1", position : "absolute", top : 20,right : 50, zIndex : 2}}  />
      <CardContent sx={{ color: "whitesmoke", position : "relative", zIndex : 5 }}>
        <Grid container direction={"row"}>
          <Grid item xs={4} sx={{width : 400, height : 300 }}>
            <img src="/asset 2.png" style={{ width : "100%", height : "100%"}} />
          </Grid>
          <Grid item xs={8}>
            <Grid container direction="column">
                <Grid item xs={12}>
                    <img src="/asset 4.png" style={{width : "100%"}} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" style={{
                        fontFamily : "Roboto",
                    }} >
                        Calon Anggota DPRD Provinsi Sulawesi Selatan
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h4" style={{
                        fontFamily : "Roboto",
                    }} >
                       Dapil Makassar A
                    </Typography>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
