import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import z from "zod";
import { tableHeader } from ".";
import { dptkeys } from "./pemilihData";

// eslint-disable-next-line react/prop-types
export default function TambahPemilih({tambah}) {
    const [open, setOpen] = useState(false)
    const { register, setError,handleSubmit, formState: { errors }, watch, reset } = useForm({
        mode: "onBlur",
        defaultValues : {
            jenis_kelamin : "L"
        },
        resolver: zodResolver(z.object({
            nik: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nkk: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nama: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            alamat: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            jenis_kelamin: z.enum(["L", "P"]),
            kelurahan: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            kecamatan: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            rt : z.string().nonempty("Tidak boleh Kosong").max(200, "Maksimal 200 huruf"),
            rw : z.string().nonempty("Tidak boleh Kosong").max(200, "Maksimal 200 huruf"),
        }))
    });

    async function submit(data) {
        const result = await tambah(data)
        console.log(result)
        if(!result.status) {
            setError("nik", {message : result.message})
            return 
        }
        setOpen(false)
        reset()

    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Tambah Pemilih
            </Button>

            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box component={"form"} onSubmit={handleSubmit(submit)}>
                    <Grid container spacing={2} direction={"column"} sx={{ padding: 5 }}>
                        <Grid item>
                            <Typography variant="h6">
                                Tambah Data Pemilih
                            </Typography>
                        </Grid>
                        {
                            tableHeader.filter(el => el != "#" && el != "Aksi" && el != "kandidat").map((el, ind) => (
                                <Grid item key={el} >
                                    {
                                        el != "Jenis Kelamin" ?
                                            <TextField label={el} size="small" {...register(dptkeys[ind])}
                                                error={!!errors[dptkeys[ind]]}
                                                helperText={errors[dptkeys[ind]]?.message}
                                            /> : <>
                                            <Typography variant="h6">
                                                {el}
                                            </Typography>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue={watch(dptkeys[ind])}
                                                    name="radio-buttons-group"
                                                    row
                                                >
                                                    <FormControlLabel value="L" control={<Radio size="small" />} label="Laki-Laki" {...register(dptkeys[ind])} />
                                                    <FormControlLabel value="P" control={<Radio size="small" />} label="Perempuan" {...register(dptkeys[ind])}/>
                                                </RadioGroup>
                                                {errors[dptkeys[ind]]?.message && <Typography variant="body2" color="red">{errors[dptkeys[ind]]?.message}</Typography>}
                                            </>
                                    }
                                </Grid>
                            ))
                        }
                        <Grid item>
                            <Button type="submit" size="medium">
                                Tambah
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}
