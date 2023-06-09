import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, tableCellClasses } from "@mui/material";
import propTypes from "prop-types"
import { kelurahan } from "../../utils/dataUtil";
import styled from "@emotion/styled";
import { useMemo, useState } from "react";


const CustomTable = styled(Table)(({ theme }) => ({


    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,

    },


}))

const CustomCell = styled(TableCell)`
    &.${tableCellClasses.head} {
        color : whitesmoke;
        fon-weight: bold;
    }
`


export default function RekapTableKelurahan({ data }) {

    const [kecamatan, setKecamatan] = useState("")
    const kelur = useMemo(() =>{
        const index = kelurahan.findIndex(el => el.kecamatan == kecamatan)
        if(index == -1) return []
        return kelurahan[index].kelurahan
    }, [kecamatan])

    return (
        <>
            <FormControl sx={{width:"50%", marginY:3}} >
                <InputLabel id="kecamatan-select-label">Kecamatan</InputLabel>
                <Select
                    labelId="kecamatan-select-label"
                    id="kecamatan-select"
                    value={kecamatan}
                    label="Kecamatan"
                    onChange={(event) => {
                        setKecamatan(event.target.value);
                    }}
                >
                    {kelurahan.map(el => (
                        <MenuItem key={el.kecamatan} value={el.kecamatan}>{el.kecamatan}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ width: "75vw", overflow: "auto" }}>

                <CustomTable>
                    <TableHead sx={{ backgroundColor: "#292D2E" }}>
                        <TableRow>
                            <CustomCell>#</CustomCell>
                            <CustomCell>Nama Kandidat</CustomCell>
                            {
                                kelur.map(el => 
                                    <CustomCell key={el}>{el}</CustomCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.keys(data).map((el, ind) => (
                                <TableRow key={el}>
                                    <TableCell>{ind + 1}</TableCell>
                                    <TableCell>{el}</TableCell>
                                    {
                                        kelur.map((el2) => (
                                            <TableCell sx={{
                                                [`&.${tableCellClasses.body}`] : {
                                                    textAlign:"center"
                                                }
                                            }} key={el2}>
                                                {data[el][el2]}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </CustomTable>
            </Box>
        </>

    )
}

RekapTableKelurahan.propTypes = {
    data: propTypes.any
}