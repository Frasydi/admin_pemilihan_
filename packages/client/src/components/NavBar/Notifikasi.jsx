import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import { GrNotification } from "react-icons/gr";
import useFetch from "../../hooks/useFetch";
import React from "react";
import Linkify from 'linkify-react';
import {TbNotification} from "react-icons/tb"
import { useNavigate } from "react-router-dom";
export function Notifikasi() {
  const nav = useNavigate()
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
            <Grid container justifyContent={"space-between"} alignItems={"center"}>
              <Grid item xs={4}>
                <Typography sx={{ padding: 2, minWidth: "100%" }} variant="h5">
                  Notifikasi
                </Typography>
              </Grid>
              <Grid item  xs={4} >
                <IconButton onClick={() => {
                  nav("/notifikasi")
                }}>
                  <TbNotification/>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <Box sx={{ overflowX: "hidden", overflowY: "auto", height: 400 }} >
              <Grid container direction={"column"} width={300} mr={3} >

                {data != null &&
                  data.map((el) => (
                    <>
                      <Grid item key={el.id}>
                        <Typography sx={{ paddingX: 3, minWidth: "100%", overflowWrap: "break-word", wordBreak: "break-word" }} >
                          <Linkify options={{ target: "_blank" }}>
                            {el.isiNotifikasi}
                          </Linkify>
                        </Typography>
                        <Typography sx={{ paddingX: 3, paddingBottom: 3, minWidth: "100%", overflowWrap: "break-word", wordBreak: "break-word" }}>
                          Tanggal : {new Date(el.created_at).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Divider />
                    </>
                  ))}
              </Grid>
            </Box>

          </Grid>

        </Grid>
      </Menu>
    </>
  );
}
