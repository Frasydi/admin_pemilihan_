import { Box, Button, Drawer, Pagination, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useMemo, useState } from "react"
import { z } from "zod";
import { useCSVReader } from 'react-papaparse';
import Swal from "sweetalert2";
import Loading from "../../../utils/Loading";

const JenisKelaminEnum = z.preprocess(val => val?.toUpperCase(), z.enum(['L', 'P']));

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
    sts_kawin: z.preprocess(val => {
        return val.split(" ").join("_")?.toUpperCase();
    }, z.enum(["S", "B", "P"])),
    tanggal_lahir : z.string(),
    jenis_kelamin: JenisKelaminEnum,
    alamat: z.string().nonempty(),
    rt: z.string().nonempty(),
    rw: z.string().nonempty(),
    kelurahan: z.string().nonempty(),
    kecamatan: z.string().nonempty(),
    tps: z.string(),
});




export default function AddCSVPemilih({ refetch }) {

    const [open, setOpen] = useState(false)
    const { CSVReader } = useCSVReader();
    const [data, setData] = useState([])
    const [Error, setError] = useState(null)
    const [page, setPage] = useState(1);
    const countData = useMemo(() => {
        if (data == null) return 0;
        return Math.ceil(data.length / 10);
    }, [data])

    const tempData = useMemo(() => {
        if (data == null) return []
        if (data.length <= 0) return [];
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;

        // Get the subset of data for the current page
        const newData = data.slice(startIndex, endIndex);
        console.log(newData);
        return newData;

    }, [data, page])

    const handleOnFileLoad = (data) => {
        console.log("Data yang diterima")
        console.log(data)
        const newData  = data.map(({ kandidatId: _, ...data }) => {
            try {
                const newData = {}
                Object.keys(data).forEach(key => {
                    const newKey = key.split(" ").join("_").toLowerCase()
                    newData[newKey] = data[key]
                })
               
                const validation = PemilihSchema.safeParse(newData)
                if (validation.success === false) {
                   
                    return null
                }
                return validation.data
            } catch (err) {
                
                
                return null
            }
        }).filter(el => el != null)
        // console.log(newData)
        if (newData.length == 0) {
            return setError("Sepertinya Data tidak valid atau kosong")
        }
        
        setError(null)
        setData(newData)
    }

    async function sendData(data) {
        const fetData = await fetch("/api/pemilih/many", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
        return fetData
    }

    async function submitData() {
        try {
            setOpen(false)
            let skip = 0
            let takes = 50000
            let success = 0
            const lengthData = Math.ceil(data.length/takes)
            while(data.slice(skip, takes).length > 0) {
                try {
                    Loading.fire({text : `${success} dari ${lengthData} bagian telah selesai`})
                    const result = await sendData(data.slice(skip, takes))
                    if(result.status >= 400) throw new Error("Cant send data")
                    success++;
                    
                }catch(err) {
                    console.error(err)
                } finally {
                    skip+= 50000
                    takes += 50000
                }
            }

            if (success == 0) return Swal.fire("Error", "Tidak ada yang selesai", "error")
            refetch()

            return Swal.fire("Berhasil", "", "success")
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
                            header: true,
                            skipEmptyLines: true,
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
                                                    {((page - 1) * 10) + ind + 1}
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