import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import SideItem from "./sideItem"
export default function SideItems({ setShow, show, item }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const ref2 = useRef(null)
    useEffect(() => {
        if (!show) {
            setOpen(false)
        }


    }, [0, show])

    return (
        <>
            <ListItem sx={{ width: show ? "100%" : 80, overflow: "hidden" }} className="list-item-data-nav" >
                <ListItemButton ref={ref2} onClick={() => {
                    setShow(true)
                    setOpen(val => !val)
                }}>
                    <ListItemIcon>
                        {item.icon}


                    </ListItemIcon>
                    <ListItemText primary={item.label}  sx={{ transition: "all .5s", overflow: "hidden", display : show ? "block" : "none" }} />
                    {
                        show ? <>
                            {
                                open ? <MdExpandMore /> : <MdExpandLess />
                            }
                        </> : <></>
                    }
                </ListItemButton>
            </ListItem>
            <Collapse ref={ref} in={open} timeout="auto" unmountOnExit>
                <List component="div" >
                    {
                        item.children.map((el, ind) => <SideItem show={show} item={el} key={ind + "nav-item"} />)
                    }
                </List>
            </Collapse>
        </>
    )
}


SideItems.propTypes = {
    item: PropTypes.any,
    show: PropTypes.bool,
    setShow: PropTypes.any
}