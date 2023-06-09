import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Drawer, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const role = ["super_admin"]

export default function TambahUser({ refetch }) {
    const [open, setOpen] = useState(false)
    const { register, formState: { errors }, setError, handleSubmit, reset } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object(
            {
                username: z.string().nonempty().max(200, "Maksimal 200 huruf").regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
                password: z.string().nonempty().max(200, "Maksimal 200 huruf").regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
                role: z.enum(role)
            }
        ))
    })

    async function tambahUser(data) {
        try {
            const fetData = await fetch("/api/user/register", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify(data)
            })
            const json = await fetData.json()
            if(json.status === false ) return setError("username", json.message)
            reset()
            setOpen(false)
            refetch()
            return 
        }catch(err) {
            console.log(err)
            setError("username", {message : "Server Error"})
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
                    <Grid container direction={"column"}>
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