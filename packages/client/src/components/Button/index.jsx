import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { brown } from "@mui/material/colors";

export const TopButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#a20409",
    color: theme.palette.getContrastText("#840407"),
    '&:hover': {
        backgroundColor: "#840407"
    }
}))