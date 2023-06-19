import {
  Box,
  Button,
  Grid,
  Input,
  InputAdornment,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import useFetch from "../../../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import TableTim from "./Tabel";
import { createContext, useContext, useEffect, useState } from "react";
import TambahTim from "./TambahTim";
import { BsSearch } from "react-icons/bs";
import useAuth from "../../../../../hooks/useAuth";

const header = {
  Kecamatan: ["#", "Kecamatan", "Jumlah Tim", "Aksi"],
  Kelurahan: ["#", "Kelurahan", "Kecamatan", "Jumlah Anggota", "Aksi"],
};

const keys = {
  Kecamatan: ["kecamatan", "_count", "action"],
  Kelurahan: ["nama", "kecamatan", "_count", "action"],
};

const TimContext = createContext({
  input: {
    nama: "",
    kecamatan: "",
  },
  setInput: () => {},
  typeInput: "add",
  setTypeInput: () => {},
  typeName: "Kecamatan",
  setTypeName: () => {},
  type: "",
  setType: () => {},
  refetch: () => {},
  openInput: false,
  setOpenInput: () => {},
});

export const useTim = () => useContext(TimContext);

export default function KandidatTimKecamatan() {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [type, setType] = useState(``);
  const { user } = useAuth();
  const [typeName, setTypeName] = useState("Kecamatan");
  const [typeInput, setTypeInput] = useState("add");
  const { data, isLoading, isError, refetch } = useFetch(
    "/api/tim/" +
      params.id +
      type +
      "?" +
      new URLSearchParams({ search: search })
  );
  const [input, setInput] = useState({
    id: -1,
    nama: "",
    kecamatan: "",
  });
  const [openInput, setOpenInput] = useState(false);
  useEffect(() => {
    refetch();
  }, [type]);
  useEffect(() => {
    const time = setTimeout(() => {
      refetch();
    }, 1000);
    return () => {
      clearTimeout(time);
    };
  }, [search]);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper mt={5} sx={{ paddingY: 5 }}>
        <Grid container direction={"column"}>
          <Grid item>
            <Typography variant="h6">List {typeName}</Typography>
          </Grid>
          <TimContext.Provider
            value={{
              input,
              setInput,
              typeInput: typeInput,
              setTypeInput,
              typeName,
              setTypeName,
              type,
              setType,
              refetch,
              openInput,
              setOpenInput,
            }}
          >
            <Grid item>
              <Grid container spacing={3}>
                {typeName == "Kelurahan" && (
                  <Grid item xs={3}>
                    <Button
                      color="error"
                      onClick={() => {
                        setTypeName("Kecamatan");
                        setType("");
                      }}
                    >
                      kembali
                    </Button>
                  </Grid>
                )}
                {[
                  "super_admin",
                  "kandidat_admin",
                  "tim_admin",
                ].includes(user.role) && (
                  <Grid item xs={3}>
                    <TambahTim id={params.id} refetch={refetch} />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid>
              <Input
                placeholder="search"
                size={"small"}
                endAdornment={
                  <InputAdornment>
                    <BsSearch />
                  </InputAdornment>
                }
                value={search}
                fullWidth
                onChange={(ev) => {
                  setSearch(ev.target.value);
                }}
                onKeyDown={() => {}}
              />
            </Grid>
            <Grid item>
              {(isLoading === true || isError == true) && (
                <Skeleton width={"100%"} height={"50vh"} />
              )}
              {isLoading == false && isError === false && (
                <TableTim
                  data={data}
                  header={header[typeName]}
                  keys={keys[typeName]}
                />
              )}
            </Grid>
          </TimContext.Provider>
        </Grid>
      </Paper>
    </Box>
  );
}
