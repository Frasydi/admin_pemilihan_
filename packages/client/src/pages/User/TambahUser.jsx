import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Drawer, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { kelurahan } from "../../utils/dataUtil"

const role = ["super_admin", "kandidat_admin", "pemilihan_admin", "tim_admin", "anggota_admin"]

export default function TambahUser({ refetch }) {
    const [open, setOpen] = useState(false)

    const { register, formState: { errors }, setError, handleSubmit, reset, watch } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object(
            {
                username: z.string().nonempty().max(200, "Maksimal 200 huruf").regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
                password: z.string().nonempty().max(200, "Maksimal 200 huruf").regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
                role: z.enum(role),
                kecamatan: z.string().nonempty().optional(),
                kelurahan: z.string().nonempty().optional()
            }
        ))
    })
    const watchKecamatan = watch("kecamatan")
    const watchRole = watch("role")
    const kelurahan2 = useMemo(() => {
        const indexOf = kelurahan.findIndex(el => el.kecamatan == watchKecamatan);
        console.log(indexOf)
        if (indexOf == -1) return []
        const result = kelurahan[indexOf]?.kelurahan
        console.log(result)
        return result
    }, [watchKecamatan])

    async function tambahUser(data) {
        try {
            const fetData = await fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const json = await fetData.json()
            if (json.status === false) return setError("username", json.message)
            reset()
            setOpen(false)
            refetch()
            return
        } catch (err) {
            console.log(err)
            setError("username", { message: "Server Error" })
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Tambah
            </Button>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box component={"form"} onSubmit={handleSubmit(tambahUser)} padding={4}>
                    <Typography variant="h5">
                        Tambah User
                    </Typography>
                    <Grid container direction={"column"} spacing={3}>
                        <Grid item>
                            <TextField
                                label={"Username"}
                                helperText={errors.username?.message || ""}
                                error={!!errors.username}
                                {...register("username")}
                            />
                        </Grid>
                        <Grid item>

                            <TextField
                                label={"Password"}
                                helperText={errors.password?.message || ""}
                                error={!!errors.password}
                                {...register("password")}
                            />
                        </Grid>
                        <Grid item>

                            <FormControl fullWidth>
                                <InputLabel id="Role-id">Role</InputLabel>
                                <Select
                                    labelId="Role-id"
                                    label="role"
                                    size="small"
                                    error={!!errors.role}
                                    helperText={errors.role?.message}

                                    {...register("role")}
                                >
                                    {
                                        role.map(el => (
                                            <MenuItem key={el} value={el}>
                                                {el}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            watchRole == "pemilihan_admin" && <>
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
                        }

                        <Grid item>
                            <Button type="submit">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>

                </Box>
            </Drawer>
        </>
    )
}

TambahUser.propTypes = {
    refetch: PropTypes.any
}