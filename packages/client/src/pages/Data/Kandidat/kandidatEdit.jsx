import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, Grid, TextField, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form";
import z from "zod";
import useKandidat from "./useKandidat";
export default function KandidatEdit() {
    const fileRef = useRef(null)
    const [image, setImage] = useState(null)
    const [open, setOpen] = useState(false)

    const kandidathook = useKandidat()
    const { register, handleSubmit, setError,setValue,formState: { errors } } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object({
            nik: z.string().nonempty(),
            nama: z.string().nonempty(),
            alamat: z.string().nonempty(),
            kelurahan: z.string().nonempty(),
            kecamatan: z.string().nonempty(),
        }))
    });

    useEffect(() => {
        if(kandidathook.selkandidat.id == -1 || kandidathook.selkandidat.id == null) {
            return
        } 
        console.log(kandidathook.selkandidat)
        setValue("nik", kandidathook.selkandidat.nik)
        setValue("nama", kandidathook.selkandidat.nama)
        setValue("alamat", kandidathook.selkandidat.alamat)
        setValue("kelurahan", kandidathook.selkandidat.kelurahan)
        setValue("kecamatan", kandidathook.selkandidat.kecamatan)
        setOpen(true);
    }, [kandidathook.selkandidat.id])

    async function editData(data) {
        
        const result = await kandidathook.edit(kandidathook.selkandidat.id, data, image)
        console.log(result)
        if(result.status === false) {
            setError("nik", {message : result.message})
            return
        }
        kandidathook.setSelKandidat({
            id : -1
        })
        setOpen(false)
    }

    

    return (
        <>
          
            <Drawer
                anchor={"right"}
                open={open}
                onClose={() => {
                    setOpen(false)
                    kandidathook.setSelKandidat({
                        id : -1
                    })
                }}
            >
                <Box component={"form"} onSubmit={handleSubmit(editData)} sx={{padding:5}} >
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
                                image != null ? <img src={URL.createObjectURL(image)} width={300} height={300} /> : kandidathook.selkandidat.gambar != null ? <img src={"/api/gambar/"+kandidathook.selkandidat.gambar} width={300} height={300} /> : null 
                            }
                           
                        </Grid>

                        <Grid item>
                            <Button variant="contained" size="medium" type="submit">
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}

KandidatEdit.propTypes = {
    tambah: PropTypes.any,
}