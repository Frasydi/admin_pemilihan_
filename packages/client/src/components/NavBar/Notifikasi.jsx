import {
  Badge,
  Divider,
  Grid,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import { GrNotification } from "react-icons/gr";
import useFetch from "../../hooks/useFetch";
import React from "react";

export function Notifikasi() {
  const { data } = useFetch("/api/notifikasi");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        onClick={(ev) => {
          if (data == null) return;
          if (data.length == 0) return;

          handleClick(ev);
        }}
      >
        <Badge badgeContent={data?.length || 0} color="primary">
          <GrNotification size={20} />
        </Badge>
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ width: 400 }}
      >
        <Grid container direction={"column"} spacing={1} width={300} mr={3}>
          <Grid item>
            <Typography sx={{padding : 2,minWidth: "100%" }} variant="h5">
              Notifikasi
            </Typography>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          {data != null &&
            data.map((el) => (
              <Grid item key={el.id}>
              <Typography sx={{ padding: 3, minWidth: "100%", overflowWrap :"break-word", wordBreak : "break-word" }} >
                {el.isiNotifikasi}
              </Typography>
              </Grid>
            ))}
        </Grid>
      </Menu>
    </>
  );
}
