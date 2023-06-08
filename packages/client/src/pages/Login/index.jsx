import { Box, Button, Grid, Paper, TextField, Typography, buttonClasses } from "@mui/material";
import { useForm } from "react-hook-form";
import PropsType from "prop-types"
import styled from "@emotion/styled";
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import useAuth from "../../hooks/useAuth";
const CustomButton = styled(Button)`
    background-color : #1DA8EC;
    width: 100%;
    color : whitesmoke;
    padding : 2px;
    
    &:hover {
        background-color : #1DA8EC;
    }
    &.${buttonClasses.active} {
        background-color: white;
    }
`

export default function Login() {
    const auth = useAuth()
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        mode: "onBlur",
        resolver : zodResolver(z.object({
            username : z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf").regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
            password : z.string().nonempty("Tidak boleh kosong").max(200, "Maksimal 200 huruf").regex(/^[^\s]+$/, "Tidak boleh ada spasi")
        }))
    });

    async function submit(val) {
        console.log(val)
        auth.login(val, (err) => {
            setError("username", {message : err})
        })

    }
    

    function CustomTextField({name, ...props}) {
        return (
            <TextField {...register(name)} {...props} sx={{
                width: "100%", padding: 0,
                "& input::placeholder": {
                    paddingInline: 2
                },
                '& .MuiOutlinedInput-input': {
                    fontFamily: "Kanit, sans-serif",
                    // Custom styles for the input element
                    padding: 1
                },
            }}
    
            />
        )
    }
    CustomTextField.propTypes  = {
        name : PropsType.string.isRequired
    }
    return (
        <>
            <Box sx={{ minHeight: "100vh", backgroundColor: "#C2BFB7" }}>
                <Grid container direction={"column"} alignItems={"center"} paddingY={15}>
                    <Grid item>
                        <Typography variant="h2" sx={{ fontFamily: "Playfair, serif" }}>
                            Login
                        </Typography>
                    </Grid>
                    <Grid item mt={2}>

                        <Paper elevation={0} sx={{ width: "35vw", minHeight: "40vh", background: "whitesmoke", padding: "1.2rem" }}>
                            <Box component={"form"} onSubmit={handleSubmit(submit)} noValidate >
                                <Grid container direction={"column"} justifyContent={"center"} alignItems="center" width={"100%"}>
                                    <Grid item xs={12} sx={{ marginTop: "2rem", width: "90%" }}>
                                        <CustomTextField placeholder={"Masukkan nama pengguna"} type="text" id="username" autoComplete="username" autoFocus  name={"username"} />
                                        {errors.username && <Typography variant="body2" color={"red"}>{errors.username.message}</Typography>}
                                    </Grid>
                                    <Grid item xs={12} sx={{ marginTop: "2rem", width: "90%" }}>
                                        <CustomTextField placeholder={"Masukkan password"} type="password" id="password" autoComplete="current-password" name={"password"} />
                                        {errors.password && <Typography variant="body2" color={"red"}>{errors.password.message}</Typography>}
                                    </Grid>
                                    <Grid item xs={12} sx={{ width: "90%", marginTop: "3rem" }}>
                                        <CustomButton type="submit">
                                            Masuk
                                        </CustomButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>
            </Box>
        </>
    )
}



