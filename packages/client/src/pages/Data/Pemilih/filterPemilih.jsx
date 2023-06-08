import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// eslint-disable-next-line react/prop-types
export default function FilterPemilih({ filter, setFilter }) {
    const [open, setOpen] = useState(false)
    const { register, watch, handleSubmit, formState: { errors }, setError } = useForm(
        {
            mode: "onBlur",
            resolver: zodResolver(z.object({
                nik: z.string().max(200),
                nkk: z.string().max(200),
                nama: z.string().max(200),
                jenis_kelamin: z.enum(["L", "P", "Semua"]),
                kelurahan: z.string().max(200),
                kecamatan: z.string().max(200)
            })),
            values: {
                ...filter
            }
        }
    )

    async function filterData(data) {
        console.log(data)
        setFilter(data)
    }

    return (
        <>
            <Button onClick={() => {
                setOpen(true)
            }}>
                Filter
            </Button>
            <Drawer
                open={open}
                anchor="right"
                onClose={() => { setOpen(false) }}
            >
                <Box padding={5} component={"form"} onSubmit={handleSubmit(filterData)} >
                    <Grid container direction={"column"} spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Filter
                            </Typography>
                        </Grid>
                        <Grid item mt={2}>
                            <TextField size="small" label="NIK"
                                {...register("nik")}
                                error={!!errors.nik}
                                helperText={errors.nik?.message}
                            />
                        </Grid>
                        <Grid item>
                            <TextField size="small" label="NKK"
                                {...register("nkk")}
                                error={!!errors.nkk}
                                helperText={errors.nkk?.message}
                            />
                        </Grid>
                        <Grid item>
                            <TextField size="small" label="Nama"
                                {...register("nama")}
                                error={!!errors.nama}
                                helperText={errors.nama?.message}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="je-kelamin-id">Jenis Kelamin</InputLabel>
                                <Select
                                    labelId="je-kelamin-id"
                                    label="Age"
                                    size="small"
                                    error={!!errors.jenis_kelamin}
                                    helperText={errors.jenis_kelamin?.message}
                                    defaultValue={filter.jenis_kelamin}
                                    {...register("jenis_kelamin")}

                                >
                                    <MenuItem value={"Semua"}>Semua</MenuItem>
                                    <MenuItem value={"L"}>Laki-laki</MenuItem>
                                    <MenuItem value={"P"}>Perempuan</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField size="small" label="Kelurahan"
                                {...register("kelurahan")}
                                error={!!errors.kelurahan}
                                helperText={errors.kelurahan?.message}
                            />
                        </Grid>
                        <Grid item>
                            <TextField size="small" label="Kecamatan"
                                {...register("kecamatan")}
                                error={!!errors.kecamatan}
                                helperText={errors.kecamatan?.message}
                            />
                        </Grid>
                        <Grid item>
                            <Button type="submit">
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}