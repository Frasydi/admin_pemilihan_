import { useEffect, useState } from "react"
import React from "react"
import useFetch from "../../hooks/useFetch";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, tableCellClasses } from "@mui/material"
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
    const [rows, setRows] = useState(10)
    const [page, setPage] = useState(0)
    const [date, setDate] = useState(new Date().getDate())
    const [search, setSearch] = useState("")
    const [tipe, setTipe] = useState("ADMIN")
    const { data, isError, isLoading, refetch } = useFetch("/api/notifikasi/search?" + "tipe=" + tipe + "&search=" + search + `&page=${page}&rows=${rows}`)

    useEffect(() => {
        const timeout = setTimeout(() => {
            refetch()
        }, 500)
        return () => {
            clearTimeout(timeout)
        }
    }, [date, tipe, search, page, rows])


    useEffect(() => {
        return () => {
            setDate(new Date().getDate())
            setTipe("ADMIN")
        }
    }, [])

    return (
        <Box >
            <Grid container direction={"column"} spacing={5}>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="tipe-notif-label">Tipe</InputLabel>
                                <Select
                                    labelId="tipe-notif-label"
                                    id="notif-tipe"
                                    value={tipe}
                                    label="Tipe"
                                    onChange={(el) => {
                                        setTipe(el.target.value)
                                    }}
                                >
                                    <MenuItem value={"ADMIN"}>Admin</MenuItem>
                                    <MenuItem value={"KANDIDAT"}>Kandidat</MenuItem>
                                    <MenuItem value={"PENDUKUNG"}>Pendukung</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField label="Search" value={search} onChange={(el) => {
                                setSearch(el.target.value)
                            }} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="h5">
                        List Notifikasi
                    </Typography>
                </Grid>
                <Grid item>
                    <TableContainer sx={{ overflowX: "auto" }}>
                        <CustomTable>
                            <TableHead sx={{ backgroundColor: "#99001a" }}>
                                <TableRow>
                                    <CustomCell>#</CustomCell>
                                    <CustomCell>Id Pencarian</CustomCell>
                                    <CustomCell>Tipe</CustomCell>
                                    <CustomCell>Isi</CustomCell>
                                    <CustomCell>Tanggal</CustomCell>
                                    <CustomCell>Lokasi</CustomCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data?.notifs != null && data?.notifs.map((item, ind) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{ind + 1}</TableCell>
                                            <TableCell>{item.searchId}</TableCell>
                                            <TableCell>{item.tipe}</TableCell>
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
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={data?._count || 0}
                        page={page}
                        onPageChange={(ev,newpage) => setPage(newpage)}
                        rowsPerPage={rows}
                        onRowsPerPageChange={(ev) => setRows(ev.target.value)}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}