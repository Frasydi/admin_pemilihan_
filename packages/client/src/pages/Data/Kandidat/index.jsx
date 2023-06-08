import Swal from "sweetalert2";
import { Box, Drawer, Grid, Input, InputAdornment, Paper, Typography } from "@mui/material";
import KandidatItem from "../../../components/KandidatList/kandidatItems";
import { createContext, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import KandidatTambah from "./kandidatAdd";
import KandidatEdit from "./kandidatEdit";
import useFetch from "../../../hooks/useFetch";

export const KandidatContext = createContext({
    hapus: () => { },
    edit : () => {},
    selkandidat : {
        id : -1,
        nik: "",
        nama: "",
        alamat: "",
        kelurahan: "",
        kecamatan: "",
        gambar : ""
    },
    setSelKandidat : () => {}
})

export default function DataKandidat() {
    const [search, setSearch] = useState("")
    const {data,refetch,isLoading} = useFetch("/api/kandidat?search="+search)
    const [selkandidat, setSelKandidat] = useState({
        id : -1,
        nama : "",
        pendukung : 0,
        jumlah_tim : 0
    })
    async function hapusKandidat(data_ind) {
        const {isConfirmed} = await Swal.fire({
            title : "Peringatan",
            text : "Apakah anda ingin menghapus kandidat ini?",
            confirmButtonText :"Iya",
            cancelButtonText : "Tidak",
            showCancelButton : true
        })
        if(!isConfirmed) return
        const fet = await fetch("/api/kandidat/del/"+data_ind, {
            method  : "DELETE",
        })
        if(fet.ok === false) return
        refetch()
    }

    async function editKandidat(kandidat_ind, data, gambar) {
        try {
            console.log(data)
            const forms = new FormData()
            Object.keys(data).forEach(el => {
                if(el == "id" || el=="gambar") return 
                forms.append(el, data[el])
                console.log(el, data[el])
            })
            if(gambar != null) {
                forms.append("gambar", gambar)
            }
            const fet = await fetch("/api/kandidat/edit/"+kandidat_ind,
            {
                method : "PUT",
                body : forms
            })
            const json = await fet.json()
            if(!fet.ok) return {
                status : false,
                message : json.message
            }
            refetch()
            return {
                status : true
            }
        }catch(err) {
            console.log(err)
            return {
                status : false,
                message : "Server Error"
            }
        }
    }

    async function tambahKandidat(kandidat, gambar) {
        const forms = new FormData()
        Object.keys(kandidat).forEach(el => {
            forms.append(el, kandidat[el])
        })
        if(gambar != null) {
            forms.append("gambar", gambar)
        }
        try {
            const fet = await fetch("/api/kandidat/add", {
                method : "POST",                
                body : forms
            })
            const json = await fet.json()
            if(!fet.ok) {

                return {
                    status : false,
                    message : json.message
                }
            }
            refetch()
            return {
                status : true
            }
        }catch(err) {
            console.log(err)
            return {
                status : false,
                message : "Error"
            }
        }
    }
    useEffect(() => {
        const fetech = setTimeout(() => {
            refetch()
        }, 1000)

        return () => {
            clearTimeout(fetech)
        }
    },[search])
    return (
        <Box>
            <Grid container direction={"column"} spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Data Kandidat
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Input placeholder="search" size={"small"} endAdornment={
                        <InputAdornment>
                            <BsSearch />
                        </InputAdornment>
                    } value={search} fullWidth onChange={(ev) => {
                        setSearch(ev.target.value)
                    }} onKeyDown={() => {

                    }} />
                </Grid>
                <Grid item={12}>
                    <Paper sx={{ paddingY: "2rem" }}>
                        <Grid container direction={"column"} spacing={3}>
                            <Grid item>
                                <KandidatTambah tambah={tambahKandidat} />
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" marginLeft={2}>
                                    List Kandidat
                                </Typography>
                            </Grid>
                            <Grid item sx={{ marginInline: "2rem" }}>
                                <Grid container spacing={1}>
                                    <KandidatContext.Provider value={{hapus : hapusKandidat, selkandidat, setSelKandidat, edit : editKandidat}}>
                                        {
                                            isLoading === false && data?.map((el, ind) => (
                                                <KandidatItem key={ind + 1} item={el} ind={ind} />
                                            ))
                                        }
                                        <KandidatEdit/>
                                    </KandidatContext.Provider>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Drawer 
            anchor="right"
            >

            </Drawer>
        </Box>
    )
}