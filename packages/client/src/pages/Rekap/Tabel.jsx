import { Box, Table, TableBody, TableCell, TableHead, TableRow, tableCellClasses } from "@mui/material";
import propTypes from "prop-types"
import { kelurahan } from "../../utils/dataUtil";
import styled from "@emotion/styled";


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


export default function RekapTable({ data }) {
    return (
        <Box sx={{width:"75vw", overflow:"auto"}}>

            <CustomTable>
                <TableHead sx={{ backgroundColor: "#292D2E" }}>
                    <TableRow>
                        <CustomCell>#</CustomCell>
                        <CustomCell>Nama Kandidat</CustomCell>
                        {
                            kelurahan.map(el => (
                                <CustomCell key={el.kecamatan}>{el.kecamatan}</CustomCell>
                            ))
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
                                    Object.keys(data[el]).map((el2) => (
                                        <TableCell key={el2}>
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

    )
}

RekapTable.propTypes = {
    data: propTypes.any
}