import { useContext, useState } from "react"
import { UserContext } from "."
import { Box, Button, CircularProgress, Drawer, Grid, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Loading from "../../utils/Loading"

export default function EditUser() {
    const [isLoading, setIsLoading] = useState(false)

    const { open, setOpen, userSelect, setSelectedInput, refetch } = useContext(UserContext)
    const { register, formState: { errors }, handleSubmit, setError } = useForm({
        resolver: zodResolver(z.object({
            username: z.string().nonempty("Tidak boleh kosong")
        })),
        mode: "onBlur",
        values: userSelect
    })

    async function editData(data) {
        if (isLoading) return
        console.log(data)
        try {
            setIsLoading(true)
            const result = await fetch("/api/user/edit/" + userSelect?.id, {
                method : "PUT",
                headers : {
                    "Content-Type": "application/json"
                },
                body  : JSON.stringify(data)
            })
            const json = await result.json()
            if (result.ok == false) {
                setIsLoading(false)
                return setError("username", { message: json.message })
            }
            setSelectedInput(null)
            refetch()
            setIsLoading(false)
            setOpen(false)
        } catch (err) {
            console.log(err)
            setError("username", {message : "Server Error"})
            setIsLoading(false)
        }
    }

    return (
        <>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box component={"form"} onSubmit={handleSubmit(editData)}>

                    <Grid container direction={"column"} spacing={4}>
                        <Grid item>
                            <Typography variant="h4">
                                Edit Username
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                {...register("username")}
                                label="Username"
                                error={!!errors.username}
                                helperText={errors.username?.message}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                isLoading ?
                                    <Box sx={{width : "100%", display :"grid", placeItems:"center"}}>
                                        <CircularProgress />
                                    </Box>
                                    :
                                    <Button type="submit" fullWidth>
                                        Edit
                                    </Button>
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    )
}