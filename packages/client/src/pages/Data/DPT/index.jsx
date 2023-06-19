import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import DPTLists from "./DPTLists";
import useFetch from "../../../hooks/useFetch";
import { useEffect, useState } from "react";
import FilterPemilih from "../Pemilih/filterPemilih";

export default function DPTData() {
  const [filter, setFilter] = useState({
    nik: "",
    nkk: "",
    nama: "",
    jenis_kelamin: "Semua",
    kelurahan: "",
    kecamatan: "",
  });
  const [kandidatId, setKandidatId] = useState(-1);
  const { data, isLoading, isError, refetch } = useFetch(
    `/api/pemilih/pendukung?${new URLSearchParams({ ...filter, kandidatId })}`
  );
  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
  } = useFetch("/api/kandidat?search=");
  useEffect(() => {
    refetch();
  }, [filter, kandidatId]);
  const exportToCsv = () => {
    // eslint-disable-next-line no-unused-vars
    const tempData = data.map(({ id, kandidat, ...rest }) => rest);
    console.log(tempData);
    let csvContent = "data:text/csv;charset=utf-8,";

    // Generate CSV header row
    const headerKeys = Object.keys(tempData[0]);
    const headerRow = headerKeys.join(",");
    csvContent += headerRow + "\r\n";

    // Generate CSV data rows
    data.forEach((rowObject) => {
      const rowValues = headerKeys.map((key) => rowObject[key]);
      const rowData = rowValues.join(",");
      csvContent += rowData + "\r\n";
    });

    // Create a temporary link element
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", encodeURI(csvContent));
    linkElement.setAttribute(
      "download",
      "data Pemilih " + new Date().toLocaleDateString("id-ID") + ".csv"
    );
    document.body.appendChild(linkElement);

    // Trigger the download
    linkElement.click();

    // Clean up the temporary link element
    document.body.removeChild(linkElement);
  };
  return (
    <Box>
      <Grid container spacing={2} direction={"column"}>
        <Grid item>
          <Typography variant="h4">Data DPT</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2} direction={"row"}>
            <Grid item>
              <FilterPemilih filter={filter} setFilter={setFilter} />
            </Grid>
            <Grid item width={200}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Kandidat</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={kandidatId}
                  label="Age"
                  onChange={(ev) => setKandidatId(ev.target.value)}
                >
                  <MenuItem value={-1}>Semua</MenuItem>
                  {!isLoading2 &&
                    data2.map((el) => (
                      <MenuItem value={el.id} key={el.id}>
                        {el.nama}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={exportToCsv}>
                Export
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {isError && isLoading ? (
            <Skeleton height={200} />
          ) : (
            <DPTLists data={data} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
