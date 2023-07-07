import { Box, Button, Drawer, Pagination, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useMemo, useState } from "react"
import { z } from "zod";
import { useCSVReader } from 'react-papaparse';
import Swal from "sweetalert2";
import Loading from "../../../utils/Loading";

const JenisKelaminEnum = z.enum(['L', 'P']);

const keysArray = [
    'nik',
    'nkk',
    'nama',
    'tempat_lahir',
    'status_kawin',
    'jenis_kelamin',
    'alamat',
    'rt',
    'rw',
    'kelurahan',
    'kecamatan',

    'tps'
];

const PemilihSchema = z.object({
    nik: z.string().nonempty(),
    nkk: z.string().nonempty(),
    nama: z.string().nonempty(),
    tempat_lahir: z.string().nonempty(),
    status_kawin: z.enum(["SUDAH_MENIKAH", "BELUM_MENIKAH"]),
    jenis_kelamin: JenisKelaminEnum,
    alamat: z.string().nonempty(),
    rt: z.string().nonempty(),
    rw: z.string().nonempty(),
    kelurahan: z.string().nonempty(),
    kecamatan: z.string().nonempty(),
    tps: z.string().nonempty(),
});




export default function AddCSVPemilih({ refetch }) {

    const [open, setOpen] = useState(false)
    const { CSVReader } = useCSVReader();
    const [data, setData] = useState([])
    const [Error, setError] = useState(null)
    const [page, setPage] = useState(1);
    const countData = useMemo(() => {
        if(data == null) return 0;
        return Math.ceil(data.length / 10);
    }, [data])

    const tempData = useMemo(() => {
        if(data == null) return []
        if (data.length <= 0) return [];
        const startIndex = (page-1) * 10;
        const endIndex = startIndex + 10;

        // Get the subset of data for the current page
        const newData= data.slice(startIndex, endIndex);
        console.log(newData);
        return newData;

    }, [data, page])

    const handleOnFileLoad = (data) => {
        console.log(data)
        const newData = data.map(({ kandidatId: _, ...data }) => {
            try {
                const validation = PemilihSchema.safeParse(data)
                if (validation.success === false) {
                    console.log(validation.error.issues[0].path + " : " + validation.error.issues[0].message)
                    return null
                }
                return validation.data
            } catch (err) {
                return null
            }
        }).filter(el => el != null)
        console.log(newData)
        if (newData.length == 0) {
            return setError("Sepertinya Data tidak valid atau kosong")
        }
        setError(null)
        setData(newData)
    }

    async function submitData() {
        try {
            setOpen(false)
            Loading.fire()
            const fetData = await fetch("/api/pemilih/many", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })
            const json = await fetData.json()
            if (fetData.ok === false) return Swal.fire("Error", json.message, "error")
            refetch()

            return Swal.fire("Berhasil", json.message, "success")
        } catch (err) {
            console.log(err)
            Swal.fire("Error", "Server Error", "error")
        }
    }


    return (
        <>

            <Button variant="outlined" onClick={() => {
                setOpen(true)
            }}>
                Import
            </Button>
            <Drawer
                anchor="top"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box padding={5}>
                    <Typography>
                        Import File Pemilih
                    </Typography>
                    <Button onClick={() => {
                        setOpen(false);
                    }}>
                        Batal
                    </Button>
                    <CSVReader
                        onUploadAccepted={(results) => {
                            handleOnFileLoad(results.data)
                        }}
                        config={{
                            header: true
                        }}
                    >
                        {({
                            getRootProps,
                            acceptedFile,
                            ProgressBar,
                            getRemoveFileProps,
                        }) => (
                            <>

                                <Button type='button' {...getRootProps()}>
                                    Browse file
                                </Button>
                                <Typography variant="body2">
                                    {acceptedFile && acceptedFile.name}
                                </Typography>
                                <Button {...getRemoveFileProps()}>
                                    Remove
                                </Button>
                                <ProgressBar />
                            </>
                        )}
                    </CSVReader>
                    {
                        (Error != null) && <Typography variant="body2">
                            {Error}
                        </Typography>
                    }
                    {
                        data.length > 0 &&
                        <>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        {
                                            keysArray.map(el => <TableCell key={el}>{el}</TableCell>)
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {
                                        tempData.map((el, ind) => (
                                            <TableRow key={el}>
                                                <TableCell >
                                                    {((page-1) * 10) + ind + 1}
                                                </TableCell>
                                                {
                                                    keysArray.map(el2 => (
                                                        <TableCell key={el2}>
                                                            {el[el2]}
                                                        </TableCell>
                                                    ))
                                                }
                                            </TableRow>))
                                    }
                                </TableBody>
                            </Table>
                            <Pagination count={countData} page={page} onChange={(ev, newPage) => setPage(newPage)} size="large" />
                        </>

                    }
                    {
                        data.length > 0 && <Button onClick={() => {
                            submitData()
                        }}>
                            Kirim
                        </Button>
                    }
                </Box>
            </Drawer>
        </>
    )
}

AddCSVPemilih.propTypes = {
    refetch: PropTypes.any
}