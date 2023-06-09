import { RxDashboard } from "react-icons/rx"
import {BsFillDatabaseFill} from "react-icons/bs"
import {ImLoop} from "react-icons/im" 
import { AiOutlineUsergroupAdd } from "react-icons/ai"

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
    },
    {
        label : "Users",
        path : "/users",
        Icon : AiOutlineUsergroupAdd,
        role : "super_admin"
    }
]