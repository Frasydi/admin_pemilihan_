/* eslint-disable react/prop-types */
import { Button, Checkbox, Grid, TableRow } from "@mui/material"
import { dptkeys } from "./pemilihData"
import useDPT from "./usePemilih"
import { CustomCell } from "."

export default function PemilihList({ el, ind, setSelected, sel }) {
    const dpt = useDPT()

    return (
        <TableRow sx={{
            "&:nth-child(even)" : {
                backgroundColor : "#DEDEDE"
            }
        }}>
            <CustomCell > <Checkbox checked={sel} onChange={() => setSelected(el.id)} inputProps={{ 'aria-label': 'controlled' }} /></CustomCell>
            <CustomCell > {ind + 1}</CustomCell>
            {

                dptkeys.map(key => {
                    if(key == "kandidatId") {
                        console.log(key)
                        return (
                            <CustomCell key={key}> {el[key] != null? el?.kandidat?.nama :"Belum Memilih"}</CustomCell>
                        )
                    }
                    return (
                        <CustomCell key={key}>{el[key]}</CustomCell>
                    )
                })
            }
            <CustomCell>
                <Grid container>
                    <Grid item>
                        <Button size="small" onClick={() => {
                            dpt.setData({ id: ind, ...el })
                        }}>
                            Edit
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button size="small" color="error" onClick={() => {
                            dpt.hapus(el.id)
                        }}>
                            Hapus
                        </Button>
                    </Grid>

                </Grid>
            </CustomCell>
        </TableRow>

    )
}