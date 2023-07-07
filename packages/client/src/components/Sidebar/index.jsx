import {
  Box,
 
  Grid,
  Grow,
  List,
  Paper,
  
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { navItems } from "../../utils/navItems";
import SideItem from "./sideItem";
import SideItems from "./sideItems";
import useAuth from "../../hooks/useAuth";
export default function Sidebar() {
  const { user } = useAuth();
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const checkIsClickInsideNav = addEventListener("click", (ev) => {
      const lists = document.querySelectorAll(".list-item-data-nav");
      for (let list of lists) {
        if (list?.contains(ev.target)) {
          return;
        }
      }

      if (!ref.current?.contains(ev.target)) {
        if (show) {
          setShow(false);
        }
        return;
      }
      if (!show) {
        setShow(true);
      }
    });
    return () => removeEventListener("click", checkIsClickInsideNav);
  }, [ref, show]);
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, zIndex: 502 }}>
      <Paper
        ref={ref}
        sx={{
          width: show ? 250 : 90,
          transition: "all .5s",
          height: "100vh",
          borderRadius: 0,
          background: "linear-gradient(to bottom, #99001a, #f00707)",
          overflowY: "auto",
          overflowX : "hidden"
        }}
      >
        <Grid container direction={"column"}>
          <Grow in={show}>
            <Grid item sx={{ width: 200, height: 200 }} alignSelf={"center"}>
              <img
                src="/asset 2.png"
                style={{ width: "100%", height: "100%" }}
              />
            </Grid>
          </Grow>
         
          <Grid item xs={12} >
            <List>
              {navItems.map((el, ind) =>
                el.children != null ? (
                  <SideItems
                    key={`${ind}-sideitem`}
                    setShow={setShow}
                    item={el}
                    show={show}
                  />
                ) : (
                  (el.role == null || el.role(user.role)) && (
                    <SideItem key={`${ind}-sideitem`} item={el} show={show} />
                  )
                )
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
