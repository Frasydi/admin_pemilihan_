import { Paper, Table, TableBody, TableCell, TableHead, TableRow, tableCellClasses } from "@mui/material";
import { dptkeys, pemilihData } from "./data";
export const tableHeader = ["#", "NIK", "NKK", "Nama", "Alamat", "Jenis Kelamin", "Kelurahan", "Kecamatan", "kandidatId"]




export default function DPTLists() {



    return (
        <Paper sx={{ paddingY: "2rem", paddingX: "1rem" }}>
            <Table  >
                <TableHead sx={{ backgroundColor: "#292D2E" }}>
                    <TableRow>
                        {
                            tableHeader.map(el => (
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
                        pemilihData.map((el, ind) => (
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