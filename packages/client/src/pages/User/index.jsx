import useAuth from "../../hooks/useAuth"
import { createContext, useEffect, useState } from "react"
import Navigator from "../../utils/Navigator"
import { Box, Button, Grid, Input, InputAdornment, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { CustomCell, CustomTable } from "../Data/Pemilih"
import useFetch from "../../hooks/useFetch"
import { BsSearch } from "react-icons/bs"
import TambahUser from "./TambahUser"
import Swal from "sweetalert2"
import EditUser from "./editUser"



export const UserContext = createContext({
    userSelect: null,
    setSelectedInput : () => {},
    open : false,
    setOpen : () => {},
    refetch : () => {}
})

export default function User() {
    const { user } = useAuth()
    const [search, setSearch] = useState("")
    const { data, refetch, isLoading, isError } = useFetch("/api/user/all?" + new URLSearchParams({ search }))
    const [selectedInout, setSelectedInput] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    async function deleteUser(id) {

        const { isConfirmed } = await Swal.fire({
            title: "Peringatan",
            icon: "question",
            text: "Apakah kau ingin menghapus akun ini?",
            showCancelButton: true,
            cancelButtonText: "Tidak",
            confirmButtonText: "Ya"
        })

        if (!isConfirmed) return

        try {
            const fetData = await fetch(`/api/user/del/${id}`,
                { method: "DELETE" }
            )
            const json = await fetData.json()
            if (json.status === false) return Swal.fire("Error", json.message, "error")
            refetch()
            return Swal.fire("Success", json.message, "success")
        } catch (err) {
            console.log(err)
            Swal.fire("Error", "Server Error", "error")
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            refetch()
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    }, [search])

    if (user?.role !== "super_admin") return (<Navigator to={"/"} />)



    return (
        <Box>
            <Paper elevation={2} sx={{ padding: 3 }}>

                <Typography variant="h4">
                    List Users
                </Typography>

                <Grid container direction={"column"} mt={3} spacing={3}>
                    <Grid item>
                        <TambahUser refetch={refetch} />
                    </Grid>
                    <Grid item>

                        <Input placeholder="search" size={"small"} endAdornment={
                            <InputAdornment>
                                <BsSearch />
                            </InputAdornment>
                        } value={search} fullWidth onChange={(ev) => {
                            setSearch(ev.target.value)
                        }} onKeyDown={() => {

                        }} />
                    </Grid>
                    <UserContext.Provider value={{userSelect : selectedInout, setSelectedInput, open : openEdit, setOpen : setOpenEdit, refetch}}>
                        <Grid item>

                            <CustomTable>
                                <TableHead sx={{ backgroundColor: "#99001a" }}>
                                    <TableRow>
                                        <CustomCell>#</CustomCell>
                                        <CustomCell>Username</CustomCell>
                                        <CustomCell>Role</CustomCell>
                                        <CustomCell>Aksi</CustomCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (!isLoading && !isError) && data.map((el, ind) => (
                                            <TableRow key={el.id} >
                                                <TableCell>
                                                    {ind + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {el.username}
                                                </TableCell>
                                                <TableCell>
                                                    {el.role}
                                                </TableCell>
                                                <TableCell>
                                                    <Button color="error" onClick={() => {
                                                        deleteUser(el.id)
                                                    }}>
                                                        Hapus
                                                    </Button>
                                                    <Button color="info" onClick={() => {
                                                        setSelectedInput(el)
                                                        setOpenEdit(true)
                                                        
                                                    }}>
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </CustomTable>
                        </Grid>
                        <EditUser/>
                    </UserContext.Provider>


                </Grid>

            </Paper>
        </Box>
    )
}