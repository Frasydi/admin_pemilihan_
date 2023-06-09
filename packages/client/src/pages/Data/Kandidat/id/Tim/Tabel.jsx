import { Button, TableBody, TableHead, TableRow } from "@mui/material";
import PropTypes from "prop-types"
import { useTim } from ".";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CustomCell, CustomTable } from "../../../Pemilih";

export default function TableTim({ data, header, keys }) {
    const tim = useTim()
    const rout = useNavigate()
    async function deleteTim(id) {
        const {isConfirmed} = await Swal.fire({
            title : "Peringatan",
            text : "Apakah anda ingin menghapus data ini?",
            showCancelButton : true,
            cancelButtonText : "Tidak",
            confirmButtonText : "Iya",
            icon : "question"
        })
        if(isConfirmed === false) return
        try {
            const fetData = await fetch("/api/tim/"+id, {
                method : "DELETE",
            })
            const json = await fetData.json()
            if(json.status === false) {
                return Swal.fire("Error", json.message, "error")
            }
            tim.refetch()
            return Swal.fire("Success", json.message, "success")
            
        }catch(err) {
            console.log(err)
            Swal.fire("Error", "Server Error", "error")
        }
    }

    return (
        <>
            <CustomTable> 
                <TableHead sx={{ backgroundColor: '#99001a' }}>
                    <TableRow>
                        {header?.map((item) => (
                            <CustomCell key={item}>{item}</CustomCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>


                    {
                        data?.map((item, ind) => (
                            <TableRow key={item.id}>
                                <CustomCell>
                                    {ind + 1}
                                </CustomCell>
                                {keys?.map((key) => {
                                    if (key == "action") {
                                        if (tim.typeName == "Kecamatan") {
                                            return (<CustomCell key={key}>
                                                <Button onClick={() => {
                                                    tim.setTypeName("Kelurahan")
                                                    tim.setType("/"+item.kecamatan)
                                                    
                                                }}>
                                                    Daftar Kelurahan
                                                </Button>
                                            </CustomCell>)
                                        } else {
                                            return (
                                            <CustomCell key={key}>
                                                <Button color="error" onClick={() => {
                                                    deleteTim(item.id)
                                                }}>
                                                    Hapus
                                                </Button>
                                                <Button color="info" onClick={() => {
                                                   tim.setOpenInput(true)
                                                   tim.setInput(item) 
                                                   tim.setTypeInput("edit")
                                                }}>
                                                    Edit
                                                </Button>
                                                <Button color="info" onClick={() => {
                                                    rout("/anggota/"+item.id)
                                                }}>
                                                    Detail
                                                </Button>
                                            </CustomCell>)
                                        }
                                    }
                                    return (
                                        <CustomCell key={key}>{item[key]}</CustomCell>
                                    )
                                })}

                            </TableRow>
                        ))
                    }

                </TableBody>
            </CustomTable>
        </>

    )
}

TableTim.propTypes = {
    data: PropTypes.arrayOf(PropTypes.any),
    header: PropTypes.arrayOf(PropTypes.string),
    keys: PropTypes.arrayOf(PropTypes.string)
}