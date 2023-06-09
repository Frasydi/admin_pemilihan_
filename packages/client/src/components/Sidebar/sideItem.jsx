import { Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types"
import { useLocation, useNavigate } from "react-router-dom";
export default function SideItem({item, show}) {
    const nav = useNavigate()
    const location = useLocation()

    return (
        <ListItem sx={{ color :"whitesmoke" , marginTop:5, paddingY : 0, width: show ? "100%" : 80, overflow: "hidden", borderRadius : "1rem", backgroundColor : item.path == location.pathname ? '#800000' : ""}} className="list-item-data-nav" >
            <ListItemButton onClick={() => {
                nav(item.path)
            }} >        
                <ListItemIcon>
                    {
                        item.Icon != null && <item.Icon color={ "whitesmoke"} />
                    }
                </ListItemIcon>
                <Collapse in={show}>
                    <ListItemText primary={item.label} sx={{ display : show ? "block" : "none"}} />
                </Collapse>
            </ListItemButton>
        </ListItem>
    )
}

SideItem.propTypes = {
    item : PropTypes.any,
    show : PropTypes.bool,
}