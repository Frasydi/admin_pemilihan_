import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";

export  function SingleKandidat() {
    const params = useParams()
    const rout = useNavigate()
    const {data, isLoading, isError} = useFetch("/api/kandidat/"+(params.id || ""))
    if(isLoading) {
        return <>
        </>
    }
    if(isError) {
        return rout("/")
    }
    return(
        <Box>
            <Grid container alignItems={"center"} mt={5} direction={"column"} height={"100vh"}>
                <Grid item>
                    <Paper elevation={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} width={600} minHeight={300} sx={{objectFit:"contain"}}>
                                <img src={"/api/gambar/"+data.gambar} alt="" width={"100%"} height={"100%"}  />
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container direction={"column"} height={"100%"} justifyContent={"center"}>
                                    <Grid item>
                                        <Typography variant="body2">
                                            NIK : {data.nik}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2">
                                            Nama : {data.nama}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2">
                                            Alamat : {data.alamat}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2">
                                            Kelurahan : {data.kelurahan}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2">
                                            Kecamatan : {data.kecamatan}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <Button  
                                                variant="text"
                                                size="small"
                                                onClick={() => {
                                                    rout("/tim/"+data.id)
                                                }}
                                                >
                                                    Tim
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )

}