import { Card, CardContent, Grid, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";

export default function Selamat_Datang() {
    const auth=useAuth()
    const [date, setDate] = useState(new Date(Date.now()))
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date(Date.now()))
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])
    
    return (
        <Card elevation={4} sx={{ width: "75vw", padding: "3rem", background: 'linear-gradient(to right, #99001a, #f00707)' }} >
            <CardContent sx={{ color: "whitesmoke" }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h4">
                            Selamat Datang
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            {auth.user.username}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            {auth.user.role}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems={"center"} spacing={2}>
                            <Grid item>
                                <AiOutlineClockCircle />
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ fontSize: 10 }} >
                                    Pukul
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 12 }}>
                                    {date.toLocaleTimeString()}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <AiOutlineCalendar />
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ fontSize: 10 }} >
                                    Tanggal
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 12 }}>
                                    {date.toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>


            </CardContent>
        </Card>
    )
}