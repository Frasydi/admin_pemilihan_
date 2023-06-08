import { RxDashboard } from "react-icons/rx"
import {BsFillDatabaseFill} from "react-icons/bs"
import {IoIosPeople} from "react-icons/io"
export const navItems = [
    {
        label : "Dashboard",
        path : "/",
        icon : <RxDashboard/>
    },
    {
        label : "Master",
        path : "/data",
        icon : <BsFillDatabaseFill/>,
        children : [
            {
                label : "Data Kandidat",
                path : "/data/kandidat"
            },
            {
                label : "Data Pemilih",
                path : "/data/pemilih"
            }
        ]
    }
]