import { Button, Checkbox, Drawer, Input, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import useFetch from "../../../../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import Swal from "sweetalert2";
import PropTypes from "prop-types"
const dptkeys = ["nik", "nkk", "nama", "alamat", "jenis_kelamin", "kelurahan", "kecamatan", "rt", "rw"]
const head = ["Select", "#", "nik", "nkk", "nama", "alamat", "Jenis Kelamin", "kelurahan", "kecamatan", "rt", "rw"]

export default function TambahAnggota({refetch}) {
    const param = useParams()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const {data, isLoading, isError,refetch:refetch2 } = useFetch("/api/pemilih/select/" + param.id + "?" + new URLSearchParams({ search }))
    const [select, setSelect] = useState([])

    async function tambahkan() {
        if(select.length == 0) return
        console.log(select)
        try {
            const fet = await fetch("/api/anggota/"+param.id, {
                method: "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({
                    data : select
                })
            })
            const json = await fet.json()
            if(fet.ok === false) {
                setOpen(false)
                return Swal.fire("Error", json.message, "error")
            }
            refetch2()
            refetch()
            setSelect([])
            setOpen(false)
            return Swal.fire("Success", json.message, "success")
        }catch(err) {
            console.log(err)
            setOpen(false)
            Swal.fire("Error", "Server Error", "error")
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            refetch2()
            console.log(select)
        }, 1000) 
        return () => {
            clearTimeout(timeout)
        }
    }, [search])


    return (
        <>
            <Button onClick={() => {
                setOpen(true)
                refetch2()
            }}>
                Tambah Anggota
            </Button>
            <Drawer
                anchor="top"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Button variant="outlined" sx={{width:100}} onClick={() => {
                    tambahkan()
                }}>
                    Tambahkan
                </Button>
                <Input placeholder="search" size={"small"} endAdornment={
                    <InputAdornment>
                        <BsSearch />
                    </InputAdornment>
                } value={search} fullWidth onChange={(ev) => {
                    setSearch(ev.target.value)
                }} onKeyDown={() => {

                }} />
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                head.map(el => (
                                    <TableCell key={el}>{el}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (!isLoading && !isError) && data.map((item, ind) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Checkbox checked={select.includes(item.id    )} onChange={() => {
                                            setSelect(ev => {
                                                const temp = [...ev]
                                                if (temp.includes(item.id)) {
                                                    const ind = temp.indexOf(item.id);
                                                    temp.splice(ind, 1)
                                                    
                                                } else {
                                                    if(temp.length >= 2) return temp
                                                    temp.push(item.id)
                                                }

                                                return temp
                                            })
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        {ind+1}
                                    </TableCell>
                                    {
                                        dptkeys.map(key => (
                                            <TableCell key={item.id + "" + key}>
                                                {item[key]}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Drawer>
        </>
    )
}

TambahAnggota.propTypes = {
    refetch : PropTypes.any
}