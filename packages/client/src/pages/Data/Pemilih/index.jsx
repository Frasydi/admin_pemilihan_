import styled from "@emotion/styled";
import { Box, Button, Grid, Pagination, Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography, tableCellClasses } from "@mui/material";
import TambahPemilih from "./tambahPemilih";
import { createContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import EditPemilih from "./editPemilih";
import PemilihList from "./pemilihlist";
import KandidatItem from "./kandidatItems";
import useFetch from "../../../hooks/useFetch";
import FilterPemilih from "./filterPemilih";
import AddCSVPemilih from "./CSV";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../utils/Loading";
import getLocation from "../../../utils/location";

export const CustomTable = styled(Table)(({ theme }) => ({


    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,

    },


}))

export const CustomCell = styled(TableCell)`
    &.${tableCellClasses.head} {
        color : whitesmoke;
        font-weight: bold;
        
    }
`

export const tableHeader = ["#", "NIK", "NKK", "Nama", "Alamat", "Tanggal Lahir", "Tempat Lahir", "Status Kawin", "Jenis Kelamin", "Kecamatan", "Kelurahan", "RT", "RW", "No HP", "TPS", "kandidat", "Aksi"]
export const PemilihContext = createContext({
    data: null,
    setData: () => { },
    edit: () => { },
    hapus: () => { }
})

export default function DataPemilih() {
    const [filter, setFilter] = useState({
        nik: "",
        nkk: "",
        nama: "",
        jenis_kelamin: "Semua",
        kelurahan: "",
        kecamatan: "",

    })
    const [rows, setRows] = useState(10)
    const [page, setPage] = useState(0);
    const { data, isLoading, refetch } = useFetch(`/api/pemilih?${new URLSearchParams({...filter, rows, page})}`)
    const { data: data2, isLoading: isLoading2, refetch: refetch2, isError: isError2 } = useFetch("/api/kandidat?search=")
    const [input, setInput] = useState(null)
    const [selData, setSelData] = useState([])
    const [pendukungCollapse, setPendukungCollapse] = useState(false)
    const countData = useMemo(() => {
        if (data == null) return 0;
        return data.length;
    }, [data])
    const { user } = useAuth()

    async function tambahDataPemilih(data) {
        try {
            console.log(data)
            const fet = await fetch("/api/pemilih/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const json = await fet.json()
            if (fet.ok === false) {
                return {
                    status: false,
                    message: json.message
                }
            }
            refetch()
            return {
                status: true
            }
        } catch (err) {
            console.log(err)
            return {
                status: false,
                message: "Server Error"
            }
        }
    }

    function setSelected(id) {
        console.log(id)
        setSelData(val => {
            const temp = [...val]
            if (val.includes(id)) {
                const ind = temp.indexOf(id)
                
                temp.splice(ind, 1)
            } else {
                temp.push(id)
            }
            
            return temp
        })
    }

    async function hapusDataPemilih(id) {
        const { isConfirmed } = await Swal.fire({
            title: "Peringatan",
            text: "Apakah anda ingin menghapus data dpt ini?",
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak",
            showCancelButton: true
        })
        if (!isConfirmed) return
        try {
            const fet = await fetch("/api/pemilih/del/" + id, {
                method: "DELETE"
            })
            const json = await fet.json()
            if (fet.ok === false) {
                return {
                    status: false,
                    message: json.message
                }
            }
            refetch()
            return {
                status: true
            }
        } catch (err) {
            console.log(err)
            return {
                status: false,
                message: "Server Error"
            }
        }


    }

    async function edit(id, data) {
        try {
            const fetData = await fetch("/api/pemilih/upd/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const json = await fetData.json()
            if (fetData.ok === false) {
                return {
                    status: false,
                    message: json.message
                }
            }

            refetch()
            setInput(null)
            return {
                status: true,
            }
        } catch (err) {
            console.log(err)
            return {
                status: false,
                message: "Server Error"
            }
        }
    }

    async function masukkanKePendukung(id) {
        Loading.fire()
        getLocation(async (location) => {
            try {

                console.log(location)
                const fet = await fetch("/api/pemilih/memilih/" + id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ dataId: selData, location: location })
                })
                const json = await fet.json()
                console.log(json.message)
                if (fet.ok === false) {
                    Swal.fire("Gagal", json.message, "error")
                    return
                }
                Swal.fire("Berhasil", "Berhasil menambahkan pendukung", "success")
                setPendukungCollapse(false)
                setSelData([])
                refetch()
                refetch2()
            } catch (err) {
                Swal.fire("Gagal", "Server Error", "error")
                console.log(err)
            }

        }, () => {
            Swal.fire("Error", "Geo Lokasi tidak aktif atau diblokir, harap aktifkan geo lokasi terlebih dahulu", "error")
        })


    }

    const exportToCsv = () => {
        // eslint-disable-next-line no-unused-vars
        const tempData = data.map(({ id, kandidat, ...rest }) => rest)
        console.log(tempData)
        let csvContent = 'data:text/csv;charset=utf-8,';

        // Generate CSV header row
        const headerKeys = Object.keys(tempData[0]);
        const headerRow = headerKeys.join(';');
        csvContent += headerRow + '\r\n';

        // Generate CSV data rows
        data.forEach((rowObject) => {
            const rowValues = headerKeys.map((key) => rowObject[key]);
            const rowData = rowValues.join(';');
            csvContent += rowData + '\r\n';
        });

        // Create a temporary link element
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', encodeURI(csvContent));
        linkElement.setAttribute('download', 'data Pemilih ' + new Date().toLocaleDateString("id-ID") + '.csv');
        document.body.appendChild(linkElement);

        // Trigger the download
        linkElement.click();

        // Clean up the temporary link element
        document.body.removeChild(linkElement);
    };

    useEffect(() => {
        setPage(0)
        setRows(10)
        refetch()
    }, [filter])

    useEffect(() => {
        refetch()
    }, [rows, page])

    return (
        <>
            <Box>

                <Typography variant="h4">
                    Data Pemilih
                </Typography>
                <Paper elevation={3} sx={{ paddingInline: "1rem", paddingY: '2rem', width: "87vw" }}>
                    <Grid container direction={"column"} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                List Pemilih
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                {
                                    user.role == "super_admin" && <Grid item>
                                        <TambahPemilih tambah={tambahDataPemilih} />
                                    </Grid>
                                }

                                <Grid item>
                                    <FilterPemilih filter={filter} setFilter={setFilter} />
                                </Grid>
                                {
                                    user.role == "super_admin" &&

                                    <>
                                        <Grid item>
                                            <Button variant="outlined" onClick={exportToCsv}>
                                                Export
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <AddCSVPemilih refetch={refetch} />
                                        </Grid>
                                    </>
                                }


                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ overflow: "auto", width: "100%" }}>
                            <PemilihContext.Provider value={{
                                data: input,
                                setData: setInput,
                                edit,
                                hapus: hapusDataPemilih
                            }}>
                                <Box sx={{overflowX :"auto"}}>

                                    <CustomTable >
                                        <TableHead sx={{ backgroundColor: '#99001a' }}>
                                            <TableRow>
                                                <CustomCell align="center" >Select</CustomCell>
                                                {
                                                    tableHeader.map(el => <CustomCell key={el} align="center" color="whitesmoke" >{el}</CustomCell>)
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                isLoading === false && data?.rows.map((el, ind) => (
                                                    <>
                                                        <PemilihList key={ind + "ind"} sel={selData.includes(el.id)} setSelected={setSelected} el={el} ind={Math.floor((page) * 10) + ind} />
                                                    </>
                                                ))
                                            }
                                        </TableBody>

                                    </CustomTable>
                                </Box>

                                <TablePagination
                                    component="div"
                                    count={data?.count || 0}
                                    page={page}
                                    onPageChange={(ev, newPage) => setPage(newPage)}
                                    rowsPerPage={rows}
                                    onRowsPerPageChange={(event) => {
                                        setRows(parseInt(event.target.value, 10))
                                        setPage(0)
                                    }}
                                />
                                <EditPemilih />
                            </PemilihContext.Provider>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <Button variant="contained" size={"small"} onClick={() => {
                                        if (!selData.length > 0) return
                                        setPendukungCollapse(true)
                                    }}>Tambahkan ke Pendukung</Button>
                                </Grid>
                                {
                                    isError2 && <Grid item>
                                        <Typography>
                                            Ada masalah
                                        </Typography>
                                    </Grid>
                                }
                                {
                                    pendukungCollapse &&
                                    <>
                                        <Grid item xs={12}>
                                            <Grid container >
                                                {
                                                    isLoading2 === false && data2?.map(el => (
                                                        <Grid item xs={4} key={el.id}>
                                                            <KandidatItem item={el} isSelected={masukkanKePendukung} />
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>

                                        </Grid>
                                        <Grid item>
                                            <Button size={"small"} variant="contained" color="error" onClick={() => setPendukungCollapse(false)}>
                                                Batalkan
                                            </Button>
                                        </Grid>
                                    </>


                                }
                            </Grid>
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </>
    )
}