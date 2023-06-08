import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { useTim } from ".";

// eslint-disable-next-line react/prop-types
export default function TambahTim({ id, refetch }) {
    
    const tim = useTim()
    const { register, setError, formState: { errors }, handleSubmit, reset, setValue } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object({
            nama: z.string().nonempty(),
            kecamatan: z.string().nonempty(),
        })),
    })
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
                    return setError("nama", {message : json.message})
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
                    return setError("nama", {message : json.message})
                }
                refetch()
                tim.setOpenInput(false)
                reset()
            }
        } catch (err) {
            console.log(err)
            Swal.fire("Gagal", "Server Error")
        }
    }
    useEffect(() => {
        setValue("nama",tim.input.nama)
        setValue("kecamatan",tim.input.kecamatan)
    }, [tim.input])
    return (
        <>
            <Button variant="contained" size="small" onClick={() => {
                tim.setTypeInput("add")
                tim.setOpenInput(true)
                tim.setInput({
                    id : -1,
                    nama : "",
                    kecamatan : ""
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
                            <TextField
                                label="Nama"
                                {...register("nama")}
                                error={!!errors.nama}
                                helperText={errors.nama?.message}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Kecamatan"
                                {...register("kecamatan")}
                                error={!!errors.kecamatan}
                                helperText={errors.kecamatan?.message}
                            />
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