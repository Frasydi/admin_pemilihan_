import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, Grid, TextField, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form";
import z from "zod";
export default function KandidatTambah({ tambah }) {
    const fileRef = useRef(null)
    const [image, setImage] = useState(null)
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, setError, formState: { errors }, reset } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object({
            nik: z.string().nonempty(),
            nama: z.string().nonempty(),
            alamat: z.string().nonempty(),
            kelurahan: z.string().nonempty(),
            kecamatan: z.string().nonempty(),
        }))
    });

    async function tambahData(data) {
        const res = await tambah(data, image)
        if (res.status === false) {
            setError("nik", { message: res.message })
            return
        }
        reset()
        setOpen(false)

    }

    return (
        <>
            <Button size={"small"} onClick={() => { setOpen(true) }}> Tambah Kandidat </Button>
            <Drawer
                anchor={"right"}
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
            >
                <Box component={"form"} onSubmit={handleSubmit(tambahData)} sx={{ padding: 5 }} >
                    <Grid container spacing={2} direction={"column"}>
                        <Grid item>
                            <Typography variant="h6">
                                Tambah Kandidat
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField label="NIK" size="small" {...register("nik")}
                                error={!!errors.nik}
                                helperText={errors.nik?.message}
                            />
                        </Grid>
                        <Grid item>
                            <TextField label="Nama" size="small" {...register("nama")}
                                error={!!errors.nama}
                                helperText={errors.nama?.message}
                            />
                        </Grid>
                        <Grid item>
                            <TextField label="Alamat" size="small" {...register("alamat")}
                                error={!!errors.alamat}
                                helperText={errors.alamat?.message} />
                        </Grid>
                        <Grid item>
                            <TextField label="Kelurahan" size="small" {...register("kelurahan")}
                                error={!!errors.kelurahan}
                                helperText={errors.kelurahan?.message} />
                        </Grid>
                        <Grid item>
                            <TextField label="Kecamatan" size="small" {...register("kecamatan")}
                                error={!!errors.kecamatan}
                                helperText={errors.kecamatan?.message} />
                        </Grid>
                        <Grid item>

                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileRef}
                                onChange={(ev) => {
                                    if(ev.target.files.length <= 0) return
                                    setImage(ev.target.files[0])
                                }}
                            />
                            <Button variant="contained" color="primary" onClick={() => {
                                fileRef.current.click()
                            }}>
                                Select File
                            </Button>
                        </Grid>
                        <Grid item>
                            {
                                image != null && 
                            <img src={URL.createObjectURL(image)} width={300} height={300} style={{objectFit :"contain"}} />
                            }
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="medium" type="submit">
                                Tambah
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}

KandidatTambah.propTypes = {
    tambah: PropTypes.any,
}