import { Box, Button, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import useFetch from "../../../../../../hooks/useFetch"
import TambahAnggota from "./Tambah"
import { useState } from "react"
import Swal from "sweetalert2"

const dptkeys = ["nik", "nkk", "nama", "alamat", "jenis_kelamin", "kelurahan", "kecamatan", "rt", "rw"]
const head = ["Select", "#", "nik", "nkk", "nama", "alamat", "Jenis Kelamin", "kelurahan", "kecamatan", "rt", "rw"]

export default function AnggotaTim() {
    const params = useParams()
    const { data, refetch, isLoading, isError } = useFetch("/api/anggota/" + params.id)
    const [select, setSelect] = useState([])
    async function hapusAnggota() {
        if(select.length == 0) return
        const { isConfirmed } = await Swal.fire({
            title: "Peringatan",
            icon: "question",
            text: "Apakah anda ingin menghapus anggota-anggota ini?",
            showCancelButton: true,
            cancelButtonText: "Tidak",
            confirmButtonText: "Ya"
        })
        if (!isConfirmed) return
        try {
            const fetData = await fetch("/api/anggota", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: select
                })
            })
            const json = await fetData.json()
            if (fetData.ok === false) return Swal.fire("Error", json.message, "error")
            setSelect([])
            refetch()
            return Swal.fire("Success", json.message, "success")
        } catch (err) {
            console.log(err)
            Swal.fire("Error", "Server Error", "error")
        }
    }
    return (
        <Box>
            <Paper elevation={2} sx={{ paddingY: 5 }}>
                <Grid container spacing={2} direction={"column"}>
                    <Grid item>
                        <Typography variant="h4">
                            List Tim Anggota
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TambahAnggota refetch={refetch} />
                            </Grid>
                            <Grid item xs={3} >
                                <Button variant="contained" color="error" onClick={() => {
                                    hapusAnggota()
                                }}>
                                Hapus Anggota
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Table>
                            <TableHead>
                                <TableRow>

                                    {
                                        head.map(el => (
                                            <TableCell key={el}>{el}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (!isLoading && !isError) && data.map((el, ind) => (
                                        <TableRow key={el.id}>
                                            <TableCell>
                                                <Checkbox checked={select.includes(el.id)} onChange={() => {
                                                    setSelect(ev => {
                                                        const temp = [...ev]
                                                        if (temp.includes(el.id)) {
                                                            const ind = temp.indexOf(el.id);
                                                            temp.splice(ind, 1)

                                                        } else {
                                                            temp.push(el.id)
                                                        }

                                                        return temp
                                                    })
                                                }} />
                                            </TableCell>
                                            <TableCell>
                                                {ind + 1}
                                            </TableCell>
                                            {
                                                dptkeys.map(key => (
                                                    <TableCell key={key}>
                                                        {el[key]}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}