import { Avatar, Box, Button, FormControlLabel, Grid, Grow, Paper, Switch, TextField, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import stringAvatar from "../../utils/stringToAvatar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2"
export default function UserProfile() {
    const { user } = useAuth()
    const [Ischangepassword, setIsChangepassword] = useState(false);
    const { register, formState: { errors }, handleSubmit } = useForm({
        mode: "onBlur",
        resolver: zodResolver(z.object({
            password: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
            newpassword: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
        }))
    })
    const handleChange = () => {
        setIsChangepassword((prev) => !prev);
    };

    async function submitPassword(data) {
        console.log(data);
        try {
            const data2 = await fetch("/api/user/changePassword/"+user.id, {
                method : "PUT",
                headers : {
                    "Content-Type": "application/json"  
                },
                body : JSON.stringify(data)
            })
            const json = await data2.json()
            if(data2.ok === false) return Swal.fire("Error",json.message, "error")
            
            return Swal.fire("success",json.message, "success")
        }catch(err) {
            console.log(err)
            Swal.fire("Error", "Server Error", "error")
        }
    }

    return (
        <Box>
            <Paper sx={{ paddingY: 10, paddingX: 5 }}>
                <Grid container alignItems={"center"} direction={"column"}>
                    <Grid item>

                        <Avatar {...stringAvatar(user.username.split("_").join(" "), { width: 150, height: 150, fontSize: 50, cursor: "default" })} />
                    </Grid>
                    <Grid item>

                        <Typography variant="h4" fontFamily={"Merriweather, serif"}>
                            {user.username.split("_").join(" ")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={<Switch Ischangepassword={Ischangepassword} onChange={handleChange} />}
                            label="Ganti Password"
                        />
                    </Grid>
                    <Grid item>
                        <Box sx={{ display: 'flex' }} component={"form"} onSubmit={handleSubmit(submitPassword)}>
                            <Grid container direction={"column"} spacing={3}>
                                <Grid item>
                                    <Grow in={Ischangepassword}>
                                        <TextField
                                            type="password"
                                            label="Password Lama"
                                            {...register("password")}
                                            error={!!errors.password}
                                            helperText={errors.password?.message || ""}
                                        />
                                    </Grow>

                                </Grid>
                                <Grid item>
                                    <Grow
                                        in={Ischangepassword}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(Ischangepassword ? { timeout: 1000 } : {})}
                                    >
                                        <TextField
                                            type="password"
                                            label="Password Baru"
                                            {...register("newpassword")}
                                            error={!!errors.newpassword}
                                            helperText={errors.newpassword?.message || ""}
                                        />
                                    </Grow>
                                </Grid>
                                <Grid item>
                                    <Grow
                                        in={Ischangepassword}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(Ischangepassword ? { timeout: 2000 } : {})}
                                    >
                                        <Button variant="contained" type="submit" >
                                            Submit
                                        </Button>
                                    </Grow>
                                </Grid>
                            </Grid>


                        </Box>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    )
}