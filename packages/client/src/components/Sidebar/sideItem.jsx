import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types"
import { useLocation, useNavigate } from "react-router-dom";
export default function SideItem({item, show}) {
    const nav = useNavigate()
    const location = useLocation()

    return (
        <ListItem sx={{ width: show ? "100%" : 80, overflow: "hidden" }} className="list-item-data-nav" >
            <ListItemButton selected={item.path == location.pathname} onClick={() => {
                nav(item.path)
            }} >        
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ display : show ? "block" : "none"}} />
            </ListItemButton>
        </ListItem>
    )
}

SideItem.propTypes = {
    item : PropTypes.any,
    show : PropTypes.bool,
}