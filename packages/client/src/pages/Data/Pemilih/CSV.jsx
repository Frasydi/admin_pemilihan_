import { Box, Button, Drawer, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import PropTypes from "prop-types"
import {  useState } from "react"
import { z } from "zod";
import { useCSVReader } from 'react-papaparse';
import Swal from "sweetalert2";

const JenisKelaminEnum = z.enum(['L', 'P']);

const keysArray = [
    'nik',
    'nkk',
    'nama',
    'jenis_kelamin',
    'alamat',
    'rt',
    'rw',
    'kelurahan',
    'kecamatan'
];

const PemilihSchema = z.object({
    nik: z.string().nonempty(),
    nkk: z.string().nonempty(),
    nama: z.string().nonempty(),
    jenis_kelamin: JenisKelaminEnum,
    alamat: z.string().nonempty(),
    rt: z.string().nonempty(),
    rw: z.string().nonempty(),
    kelurahan: z.string().nonempty(),
    kecamatan: z.string().nonempty()
});




export default function AddCSVPemilih({ refetch }) {

    const [open, setOpen] = useState(false)
    const { CSVReader } = useCSVReader();
    const [data, setData] = useState([])
    const [Error, setError] = useState(null)
    const handleOnFileLoad = (data) => {
        console.log(data)
        const newData = data.map(({kandidatId : _, ...data}) => {
            try {
                const validation = PemilihSchema.safeParse(data)
                if (validation.success === false) {
                     console.log(validation.error.issues[0].path + " : "+validation.error.issues[0].message)
                    return null
                }
                return validation.data
            }catch(err) {
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
            const fetData = await fetch("/api/pemilih/many", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify(data),
            })
            const json = await fetData.json()
            if(fetData.ok === false) return Swal.fire("Error", json.message, "error")
            refetch()
            setOpen(false)
            return Swal.fire("Berhasil",json.message, "success")
        }catch(err) {
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
                                    data.map((el, ind) => (
                                        <TableRow key={el}>
                                            <TableCell >
                                                {ind + 1}
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