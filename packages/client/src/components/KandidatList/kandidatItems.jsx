import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";
import useKandidat from "../../pages/Data/Kandidat/useKandidat";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function KandidatItem({ item }) {
  const kandidat = useKandidat();
  const rout = useNavigate();
  const { user } = useAuth();
  return (
    <>
      <Grid item xs={4}>
        <Card>
          <CardMedia
            image={
              item?.gambar != null ? "/api/gambar/" + item.gambar : "/blank.png"
            }
            sx={{ width: 300, height: 300, objectFit: "contain", backgroundSize : "contain" }}
          ></CardMedia>
          <CardContent>
            <Typography variant="h6">{item?.nama}</Typography>
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              Jumlah Pendukung : {item?.pemilih}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              Jumlah Tim : {item?.tim}
            </Typography>
          </CardContent>
          <CardActions>
            <Grid container spacing={2}>
              <Grid item>
                <button
                  className="button-10"
                  role="button"
                  onClick={() => {
                    rout("/data/kandidat/" + item.id);
                  }}
                >
                  Detail
                </button>
              </Grid>
              {user.role != "super_admin" ||
                (user.role != "kandidat_admin" && (
                  <>
                    <Grid item>
                      <button
                        className="button-10"
                        role="button"
                        onClick={() => {
                          kandidat.setSelKandidat({ ...item });
                        }}
                      >
                        Edit
                      </button>
                    </Grid>
                    <Grid item>
                      <button
                        className="deletebtn"
                        role="button"
                        onClick={() => {
                          kandidat.hapus(item.id);
                        }}
                      >
                        Hapus
                      </button>
                    </Grid>
                  </>
                ))}
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}

KandidatItem.propTypes = {
  item: PropTypes.any,
  ind: PropTypes.number,
};
