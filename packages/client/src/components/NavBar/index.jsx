import { Avatar, Box, Breadcrumbs, Grid, Link, Menu, MenuItem, Paper, Typography } from "@mui/material";
import stringAvatar from "../../utils/stringToAvatar";
import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

export default function NavBar() {
    const auth = useAuth()
    const [isTop, setIsTop] = useState(false)
    const pathname = useLocation()

    const paths = useMemo(() => {
        return (pathname.pathname).split("/")
    }, [pathname.pathname])
    useEffect(() => {
        const scroll = addEventListener("scroll", () => {
            console.log(window.scrollY)
            console.log(isTop)
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
                backdropFilter: "blur(2px)", backgroundColor: isTop ? "rgba(255,255,255,.5)":"transparent" , transition : "all .5s" 
            }} >
                <Box width={"100%"} height={"100%"} paddingX={"20px"}  >
                    <Grid container sx={{ height: "100%", width: "100%" }} justifyContent={"space-between"} alignItems={"center"} >
                        <Grid item xs={5} >
                            <Breadcrumbs>
                                {paths.length > 1 && paths.map((el, ind) => {
                                    if(ind == 0) return (
                                        <Link key={el} color={"inherit"} href={"/"}>
                                            beranda
                                        </Link>
                                    )
                                    if(ind == paths.length-1) return
                                    const link = paths.slice(0, ind + 1).join("/");
                                    console.log(link)
                                    return(
                                    <Link key={el} color={"inherit"} href={link}>
                                        {el}
                                    </Link>
                                )})}
                                <Typography color="text.primary">{paths[paths.length-1]}</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item  marginRight={5}>
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
    const rout = useNavigate()
    const open = Boolean(anchorEl);
    const ref = useRef(null)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const mouse = addEventListener("click", (ev) => {
            if (!ref.current.contains(ev.target)) {
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

                <MenuItem onClick={() => {
                    handleClose()
                    rout("/profile")
                }}>Profile</MenuItem>
                <MenuItem onClick={(ev) => {
                    handleClose(ev)
                    auth.logout()
                }}>Logout</MenuItem>
            </Menu>
        </Box>
    )
}