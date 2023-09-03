import { Box, Grid, Grow, Paper, Typography } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { VerticalBarSeries, XAxis, XYPlot, YAxis } from "react-vis";
import { useMemo } from "react";
import RekapTable from "./Tabel";
import RekapTableKelurahan from "./TabelKelurahan";

export default function Recap() {
    const { data, refetch, isLoading, isError } = useFetch("/api/kandidat/recap")

    const keysKandidat = useMemo(() => {
        if (isLoading || isError) return []

        return Object.keys(data.kecamatan)
    }, [data])

    const optionChart = {
        plugins: {
            datalabels: {
                display: true,

                align: 'end',
                backgroundColor: '#ccc',
                borderRadius: 3,
                font: {
                    size: 18,
                },
                formatter: (value) => {
                    return value + "";
                },
            }
        },
    }

    return (
        <Box>
            <Paper elevation={2} sx={{ paddingY: 1 }} >
                <Grid container direction={"column"} ml={4}>
                    <Grid item>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Rekap Data
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" ml={3} >
                            Perbandingan Pendukung antar Kandidat
                        </Typography>
                    </Grid>
                    <Grid item alignSelf={"center"}>
                        <Grow in={!isLoading && !isError}>
                            <img width={300} height={200} src={`https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(
                                {
                                    type: 'pie',
                                    data: {
                                        labels: data?.kandidat != null ? data.kandidat?.map(el => el.x) : [],
                                        datasets: [{
                                            data: data?.kandidat != null ? data.kandidat?.map(el => el.y) : []
                                        }]
                                    },
                                    options: optionChart
                                }
                            ))}`} />

                        </Grow>

                    </Grid>
                    
                    <Grid item mt={5}>
                        <Typography variant="h6">
                            Rekap dari masing-masing kandidat
                        </Typography>
                    </Grid>
                    {
                        keysKandidat?.map(el => (
                            <Grid item key={el} ml={3}>
                                <Typography variant="h5" fontWeight={"bolder"}>
                                    {el}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" fontWeight={"bolder"} ml={3}>
                                            Kecamatan
                                        </Typography>

                                        <img width={300} height={200} src={`https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(
                                            {
                                                type: 'pie',
                                                data: {
                                                    labels: data.kecamatan[el].map(el => el.x),
                                                    datasets: [{
                                                        data: data.kecamatan[el].map(el => el.y)
                                                    }]
                                                }, options: optionChart
                                            }
                                        ))}`} />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="h6" fontWeight={"bolder"} ml={3}>
                                            Kelurahan
                                        </Typography>

                                        <img width={300} height={200} src={`https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(
                                            {
                                                type: 'pie',
                                                data: {
                                                    labels: data.kelurahan[el].map(el => el.x),
                                                    datasets: [{
                                                        data: data.kelurahan[el].map(el => el.y)
                                                    }]
                                                },
                                                options: optionChart

                                            }
                                        ))}`} />
                                    </Grid>
                                </Grid>



                            </Grid>
                        ))
                    }

                </Grid>
            </Paper>

        </Box>
    )
}