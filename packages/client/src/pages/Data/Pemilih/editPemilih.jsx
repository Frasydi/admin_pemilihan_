import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { tableHeader } from ".";
import { dptkeys } from "./pemilihData";
import useDPT from "./usePemilih";
import { kelurahan } from "../../../utils/dataUtil";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

// eslint-disable-next-line react/prop-types
export default function EditPemilih() {
    const dpt = useDPT()
    const [open, setOpen] = useState(false)
    const { control, register, handleSubmit, setError, formState: { errors }, watch } = useForm({
        mode: "onBlur",
        values: dpt.data,
        resolver: zodResolver(z.object({
            nik: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nkk: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nama: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            alamat: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            tanggal_lahir: z.string(),
            tempat_lahir: z.string().nonempty(),
            sts_kawin: z.enum(["B", "P", "S"]),
            jenis_kelamin: z.enum(["L", "P"]),
            kelurahan: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            kecamatan: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            rt: z.string().nonempty("Tidak boleh Kosong").max(200, "Maksimal 200 huruf"),
            rw: z.string().nonempty("Tidak boleh Kosong").max(200, "Maksimal 200 huruf"),
            tps: z.string()
        }))
    });

    function submit(data) {
        console.log(data)
        const result = dpt.edit(dpt.data.id, data)
        if (result.status === false) {
            setError("nik", { message: result.message })
            return
        }

        setOpen(false)

    }

    const watchKecamatan = watch("kecamatan")
    const kelurahan2 = useMemo(() => {
        const indexOf = kelurahan.findIndex(el => el.kecamatan == watchKecamatan);
        console.log(indexOf)
        if (indexOf == -1) return []
        const result = kelurahan[indexOf]?.kelurahan
        console.log(result)
        return result
    }, [watchKecamatan])

    useEffect(() => {
        if (dpt.data?.nama == null) return
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
                            tableHeader.filter(el => el != "#" && el != "Aksi" && el != "kandidat" && el != "No HP").map((el, ind) => {

                                if (el == "Kecamatan") {
                                    return (<>
                                        <Grid item>
                                            <FormControl fullWidth>
                                                <InputLabel id="kecamatan-id">Kecamatan</InputLabel>
                                                <Select
                                                    labelId="kecamatan-id"
                                                    label="Age"
                                                    size="small"
                                                    error={!!errors.kecamatan}
                                                    helperText={errors.kecamatan?.message}
                                                    defaultValue={dpt.data?.kecamatan}
                                                    {...register("kecamatan")}
                                                >
                                                    {
                                                        kelurahan.map(el => (
                                                            <MenuItem key={el.kecamatan} value={el.kecamatan}>
                                                                {el.kecamatan}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                    </>

                                    )
                                } else if (el == "Kelurahan") {
                                    return (
                                        <>
                                            <Grid item>
                                                <FormControl fullWidth>
                                                    <InputLabel id="kecamatan-id">Kelurahan</InputLabel>
                                                    <Select
                                                        labelId="kecamatan-id"
                                                        label="Kelurahan"
                                                        size="small"
                                                        error={!!errors.kelurahan}
                                                        helperText={errors.kelurahan?.message}
                                                        defaultValue={dpt.data?.kelurahan}
                                                        {...register("kelurahan")}
                                                    >
                                                        {
                                                            kelurahan2?.map(el => (
                                                                <MenuItem key={el} value={el}>
                                                                    {el}</MenuItem>
                                                            ))
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )
                                } else if (el == "Status Kawin") {
                                    return (
                                        <>
                                            <Grid item>
                                                <FormControl fullWidth>
                                                    <InputLabel id="status-kawin-id">Status Kawin</InputLabel>
                                                    <Select
                                                        labelId="status-kawin-id"
                                                        label="Status Kawin"
                                                        size="small"
                                                        error={!!errors.sts_kawin}
                                                        defaultValue={dpt.data?.sts_kawin}
                                                        {...register("sts_kawin")}
                                                    >

                                                        <MenuItem key={"status-kawin-menikah"} value={"S"}>
                                                            Sudah Menikah</MenuItem>
                                                        <MenuItem key={"status-kawin-belum-menikah"} value={"B"}>
                                                            Belum Menikah</MenuItem>
                                                        <MenuItem key={"status-kawin-pernah-menikah"} value={"P"}>
                                                            Pernah Menikah</MenuItem>




                                                    </Select>
                                                    {
                                                        errors.sts_kawin && <Typography color="red" variant="body2">{errors.sts_kawin.message}</Typography>
                                                    }
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )
                                
                                } else if (el == "TPS") {
                                    return (
                                        <Grid item>

                                            <TextField label={el} size="small" {...register("tps")}
                                                error={!!errors.tps}
                                                helperText={errors.tps?.message}
                                            />
                                        </Grid>
                                    )
                                }
                                return (
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
                                                        <FormControlLabel value="P" control={<Radio size="small" />} label="Perempuan" {...register(dptkeys[ind])} />
                                                    </RadioGroup>
                                                    {errors[dptkeys[ind]]?.message && <Typography variant="body2" color="red">{errors[dptkeys[ind]]?.message}</Typography>}
                                                </>
                                        }
                                    </Grid>
                                )
                            })
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
