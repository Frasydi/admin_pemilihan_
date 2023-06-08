import { Avatar, Box, Grid, Menu, MenuItem, Paper } from "@mui/material";
import stringAvatar from "../../utils/stringToAvatar";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {

    const [isTop, setIsTop] = useState(false)

    useEffect(() => {
        const scroll = addEventListener("scroll", () => {
            console.log(window.scrollY)
            setIsTop(window.scrollY != 0)
        })

        return () => {
            removeEventListener("scroll", scroll)
        }
    }, [])

    return (
        <Box sx={{ position: "sticky", top: 0, left: 0, zIndex: 501, height: "10vh", width: "99%", maxwidth: "100vw", display: "grid", placeItems: "center", marginTop: "1rem" }}>
            <Paper elevation={isTop ? 5 : 0} sx={{
                width: "95%", height: "95%", ":-webkit-backdrop-filter": "blur(5px)",
                backdropFilter: "blur(5px)", backgroundColor: isTop ? "transparent" : "rgba(255,255,255,0.5)"
            }} >
                <Box width={"100%"} height={"100%"} paddingX={"20px"} >
                    <Grid container sx={{ height: "100%", width: "100%" }} justifyContent={"end"} alignItems={"center"} >
                        <Grid item xs={7}>
                        </Grid>
                        <Grid item xs={1}>
                            <Profile />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box >
    )
}

function Profile() {
    const [anchorEl, setAnchorEl] = useState(null);
    const auth = useAuth()
    const open = Boolean(anchorEl);
    const ref= useRef(null)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const mouse = addEventListener("click", (ev) => {
            if(!ref.current.contains(ev.target)) {
                setAnchorEl(null)
            }
        })
        return () => {
            removeEventListener("click", mouse)
        }
    }, [ref])

    return (
        <Box ref={ref}>
            <Avatar onClick={handleClick} {...stringAvatar("User Name Name")} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={(ev) => {
                    handleClose(ev)
                    auth.logout()
                }}>Logout</MenuItem>
            </Menu>
        </Box>
    )
}