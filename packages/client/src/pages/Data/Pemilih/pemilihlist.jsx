import { Button, Checkbox, Grid, TableCell, TableRow } from "@mui/material"
import { dptkeys } from "./pemilihData"
import useDPT from "./usePemilih"

// eslint-disable-next-line react/prop-types
export default function PemilihList({ el, ind, setSelected, sel }) {
    const dpt = useDPT()

    return (
        <TableRow>
            <TableCell > <Checkbox checked={sel} onChange={(ev) => setSelected(el.id)} inputProps={{ 'aria-label': 'controlled' }} /></TableCell>
            <TableCell > {ind + 1}</TableCell>
            {

                dptkeys.map(key => {
                    if(key == "kandidatId") {
                        console.log(key)
                        return (
                            <TableCell key={key}> {el[key] != null? el?.kandidat?.nama :"Belum Memilih"}</TableCell>
                        )
                    }
                    return (
                        <TableCell key={key}>{el[key]}</TableCell>
                    )
                })
            }
            <TableCell>
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
            </TableCell>
        </TableRow>

    )
}