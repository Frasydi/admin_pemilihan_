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
                path : "/data/kandidat",
                role : (role) => ["super_admin", "kandidat_admin","tim_admin", "anggota_admin"].includes(role)
            },
            {
                label : "Data Pemilih",
                path : "/data/pemilih",
                role : (role) => role == "super_admin" || role == "pemilihan_admin"
            }, 
            {
                label : "Data Pendukung",
                path : "/data/dpt",
                role : (role) => role == "super_admin" || role == "pemilihan_admin"
            }
        ]
    },
    {
        label : "Rekap",
        path : "/rekap",
        Icon : ImLoop,
    },
    {
        label : "Users",
        path : "/users",
        Icon : AiOutlineUsergroupAdd,
        role : (role) => role == "super_admin"
    }
]