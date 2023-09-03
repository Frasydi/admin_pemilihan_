import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { tableHeader } from ".";
import { dptkeys } from "./pemilihData";
import { kelurahan } from "../../../utils/dataUtil";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.locale('en');
// eslint-disable-next-line react/prop-types
export default function TambahPemilih({ tambah }) {

    const [open, setOpen] = useState(false)
    const { control, register, setError, handleSubmit, formState: { errors }, watch, reset } = useForm({
        mode: "onBlur",
        defaultValues: {
            jenis_kelamin: "L",

        },
        resolver: zodResolver(z.object({
            nik: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nkk: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            nama: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            alamat: z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf"),
            tanggal_lahir: z.date().refine((value) => value instanceof Date, {
                message: 'Please select a valid date',
            }),
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

    async function submit(data) {
        const tanggal = data.tanggal_lahir
        console.log({ ...data, tanggal_lahir: (tanggal.getDate() + 1) + "|" + (tanggal.getMonth() + 1) + "|" + tanggal.getFullYear() })


        const result = await tambah({ ...data, tanggal_lahir: (tanggal.getDate() + 1) + "|" + (tanggal.getMonth() + 1) + "|" + tanggal.getFullYear() })
        console.log(result)
        if (!result.status) {
            setError("nik", { message: result.message })
            return
        }
        setOpen(false)
        reset()


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

    return (
        <>
            <Button variant="contained" color="success" onClick={() => setOpen(true)}>
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
                                                    defaultValue={""}
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
                                } else if (el == "Tanggal Lahir") {
                                    return (
                                        <>
                                            <Grid item>
                                                <Controller
                                                    name="tanggal_lahir"
                                                    control={control}

                                                    render={
                                                        ({ field: { onChange, ...restField } }) =>
                                                            <DatePicker
                                                                label="Tanggal Lahir"
                                                                onChange={(event) => {
                                                                    onChange(event.toDate());
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField
                                                                        {...params}
                                                                    />}
                                                                {...restField}
                                                            />
                                                    }
                                                />
                                            </Grid>
                                            {
                                                errors.tanggal_lahir != null && <Typography variant="body2" color="red">{errors.tanggal_lahir?.message}</Typography>
                                            }
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
                                Tambah
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}
