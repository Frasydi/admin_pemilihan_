import { RxDashboard } from "react-icons/rx"
import {BsFillDatabaseFill} from "react-icons/bs"
import {ImLoop} from "react-icons/im" 

export const navItems = [
    {
        label : "Dashboard",
        path : "/",
        Icon : RxDashboard
    },
    {
        label : "Master",
        path : "/data",
        Icon : BsFillDatabaseFill,
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
    },
    {
        label : "Rekap",
        path : "/rekap",
        Icon : ImLoop
    }
]