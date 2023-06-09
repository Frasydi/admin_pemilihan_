import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { useTim } from ".";
import {  kelurahan } from "../../../../../utils/dataUtil";

// eslint-disable-next-line react/prop-types
export default function TambahTim({ id, refetch }) {

    const tim = useTim()
    const { register, setError, watch,formState: { errors }, handleSubmit, reset, setValue } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object({
            nama: z.string().nonempty(),
            kecamatan: z.string().nonempty(),
        })),
    })
    const watchKecamatan = watch("kecamatan")
    const kelurahan2 = useMemo(() => {
        const indexOf = kelurahan.findIndex(el => el.kecamatan == watchKecamatan);
        console.log(indexOf)
        if(indexOf == -1) return []
        const result = kelurahan[indexOf]?.kelurahan
        console.log(result)
        return result
    }, [watchKecamatan])
    
    async function submitData(data) {
        try {
            if (tim.typeInput == "add") {
                const fetData = await fetch(`/api/tim/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                const json = await fetData.json();
                console.log(json)
                if (fetData.ok === false) {
                    return setError("nama", { message: json.message })
                }
                refetch()
                tim.setOpenInput(false)
                reset()
            } else {
                const fetData = await fetch(`/api/tim/${tim.input.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                const json = await fetData.json();
                console.log(json)
                if (fetData.ok === false) {
                    return setError("nama", { message: json.message })
                }
                refetch()
                tim.setOpenInput(false)
                
            }
        } catch (err) {
            console.log(err)
            Swal.fire("Gagal", "Server Error")
        }
    }


    useEffect(() => {
        console.log(tim.input)
        setValue("kecamatan", tim.input.kecamatan)
        setValue("nama", tim.input.nama)
    }, [tim.input])
    return (
        <>
            <Button variant="contained" size="small" onClick={() => {
                tim.setTypeInput("add")
                tim.setOpenInput(true)
                tim.setInput({
                    id: -1,
                    nama: "",
                    kecamatan: ""
                })
            }}>
                Tambah Tim
            </Button>

            <Drawer
                anchor="right"
                open={tim.openInput}

                onClose={() => tim.setOpenInput(false)}
            >
                <Box component={"form"} onSubmit={handleSubmit(submitData)} padding={3}>
                    <Grid container direction={"column"} spacing={3}>
                        <Grid item>
                            <Typography>
                                {tim.typeInput == "add" ? "Tambah Tim" : "Edit Tim"}
                            </Typography>
                        </Grid>
                        
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="kecamatan-id">Kecamatan</InputLabel>
                                <Select
                                    labelId="kecamatan-id"
                                    label="Age"
                                    size="small"
                                    error={!!errors.kecamatan}
                                    helperText={errors.kecamatan?.message}
                                    defaultValue={tim.input.kecamatan || ""}
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
                        <Grid item>
                        <FormControl fullWidth>
                                <InputLabel id="kecamatan-id">Kelurahan</InputLabel>
                                <Select
                                    labelId="kecamatan-id"
                                    label="Kelurahan"
                                    size="small"
                                    error={!!errors.nama}
                                    helperText={errors.nama?.message}
                                    defaultValue={tim.input.nama || ""}
                                    {...register("nama")}
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
                        <Grid item>
                            <Button type="submit">
                                {tim.typeInput == "add" ? "Tambah" : "Edit"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}