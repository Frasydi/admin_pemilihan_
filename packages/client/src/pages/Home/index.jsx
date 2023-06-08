import { Box, Grid} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import Selamat_Datang from "./Selamat Datang";
import Statistik from "./Statistik";
import useFetch from "../../hooks/useFetch";


export default function Home() {
    const auth = useAuth()
    const {data, isLoading, isError} = useFetch("/api/util")
    return (
        <Box >
            <Grid container spacing={5} direction={"column"}  >
                <Grid item alignSelf={"center"} xs={12}>
                    <Selamat_Datang/>
                </Grid>
                <Grid item xs={12}>
                   { (!isLoading&& !isError) && <Statistik kandidat={data.kandidat} tim={data.tim} pemilih={data.pemilih}  />}
                </Grid>
            </Grid>
        </Box>
    )
}