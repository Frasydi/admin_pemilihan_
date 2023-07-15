import { useEffect, useState } from "react"
import React from "react"
import useFetch from "../../hooks/useFetch";
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, tableCellClasses } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import styled from "@emotion/styled";
import Linkify from "linkify-react";


const CustomTable = styled(Table)(({ theme }) => ({


    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,

    },


}))

const CustomCell = styled(TableCell)`
    &.${tableCellClasses.head} {
        color : whitesmoke;
        fon-weight: bold;
    }
`


export default function NotifikasiPage() {
    const [date, setDate] = useState(new Date().getDate())
    const { data, isError, isLoading, refetch } = useFetch("/api/notifikasi/" + date)

    useEffect(() => {
        console.log(date)
        refetch()
    }, [date])

    useEffect(() => {
        return () => {
            setDate(new Date().getDate())
        }
    }, [])

    return (
        <Box >
            <Grid container direction={"column"} spacing={5}>
                <Grid item>
                    <DatePicker disableFuture onChange={(val) => {
                        setDate(val.date())
                    }} />
                </Grid>
                <Grid item>
                    <Typography variant="h5">
                        List Notifikasi
                    </Typography>
                </Grid>
                <Grid item>
                    <CustomTable>
                        <TableHead sx={{ backgroundColor: "#99001a" }}>
                            <TableRow>
                                <CustomCell>#</CustomCell>
                                <CustomCell>Isi</CustomCell>
                                <CustomCell>Tanggal</CustomCell>
                                <CustomCell>Lokasi</CustomCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data != null && data.map((item, ind) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{ind + 1}</TableCell>
                                        <TableCell>{item.isiNotifikasi}</TableCell>
                                        <TableCell>{new Date(item.created_at).toLocaleDateString("id-ID")}</TableCell>
                                        <TableCell>
                                            {
                                                item.lat == null || item.long == null ? "Tidak memiliki lokasi" :
                                                    <Button href={`https://www.google.com/maps?q=${item.lat},${item.long}`} target="_blank">
                                                        Lihat Lokasi
                                                    </Button>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </CustomTable>
                </Grid>
            </Grid>
        </Box>
    )
}