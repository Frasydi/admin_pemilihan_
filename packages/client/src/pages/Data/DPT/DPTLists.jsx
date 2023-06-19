/* eslint-disable react/prop-types */
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, tableCellClasses } from "@mui/material";
import { tableHeader } from "../Pemilih";
import { dptkeys } from "../Pemilih/pemilihData";




export default function DPTLists({data}) {



    return (
        <Paper sx={{ paddingY: "2rem", paddingX: "1rem" }}>
            <Table  >
                <TableHead sx={{ backgroundColor: "#292D2E" }}>
                    <TableRow>
                        {
                            tableHeader.filter(el => el != "Aksi").map(el => (
                                <TableCell sx={{
                                    [`&.${tableCellClasses.head}`]: {
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    },



                                }} key={el}>{el}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data?.map((el, ind) => (
                            <TableRow key={el}>
                                <TableCell sx={{
                                    [`&.${tableCellClasses.body}`]: {
                                        textAlign: "center"
                                    }
                                }} >{ind + 1}</TableCell>
                                {

                                    dptkeys.map(key => (
                                        <TableCell key={key} sx={{
                                            [`&.${tableCellClasses.body}`]: {
                                                textAlign: "center"
                                            }
                                        }}>{el[key]}</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Paper>
    )
}