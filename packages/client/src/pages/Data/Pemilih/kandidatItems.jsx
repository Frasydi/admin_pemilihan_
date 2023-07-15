/* eslint-disable react/prop-types */
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";

export default function KandidatItem({ item, isSelected }) {
    return (
        <>
            <Card>
                <CardActionArea onClick={() => {
                    isSelected(item.id)
                }} >
                    <CardMedia sx={{ objectFit:"cover", width :"100%", height :"300px" }} image={item.gambar!= null ? "/api/gambar/"+item.gambar : "/blank.png"} />
                    <CardContent>
                        <Typography variant="h5" align="center">
                            {item.nama}
                        </Typography>
                        
                        <Typography variant="body2">
                            Jumlah Pendukung : {item.pemilih}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}