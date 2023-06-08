import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import {  useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import z from "zod";
import { tableHeader } from ".";
import { dptkeys } from "./pemilihData";
import useDPT from "./usePemilih";

// eslint-disable-next-line react/prop-types
export default function EditPemilih() {
    const dpt = useDPT()
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, setError,formState: { errors }, watch, reset } = useForm({
        mode: "onBlur",
        values : dpt.data,
        resolver: zodResolver(z.object({
            nik: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nkk: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nama: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            alamat: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            jenis_kelamin: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            kelurahan: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            kecamatan: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            rt : z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            rw : z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
        }))
    });

    function submit(data) {
        const result = dpt.edit(dpt.data.id, data)
        if(result.status === false) {
            setError("nik", {message : result.message})
            return
        }

        setOpen(false)
        
    }
    
    useEffect(() => {
        if(dpt.data?.nama == null) return
        setOpen(true)
    }, [dpt.data?.nama])

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                    dpt.setData(null)
                }}
            >
                <Box component={"form"} onSubmit={handleSubmit(submit)}>
                    <Grid container spacing={2} direction={"column"} sx={{ padding: 5 }}>
                        <Grid item>
                            <Typography variant="h6">
                                Edit Data Pemilih
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
                                            <Typography variant="body1">
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
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}
