import { z } from "zod";
import { IResult } from "../types/Iresult";
import { getNotifikasi, getNotifikasiByDate } from "../service/Notifikasi";
import { NotifTipe, notifikasi } from "@prisma/client";


export async function findNotifikasi() :IResult<notifikasi[]>{
    
    return await getNotifikasi()

}

export async function NotifikasiByDate( tipe : String, search : string, rows : number, page : number) : IResult<{notifs : notifikasi[], _count : number}> {
    
    if(z.enum(["ADMIN" , "KANDIDAT" , "PENDUKUNG"]).safeParse(tipe).success == false) {
        return {
            status : false,
            code : 400,
            message : "Tipe Notif is not an valid type"
        }
    }
    if(z.string().safeParse(search).success === false)  {
        return {
            status : false,
            code : 400,
            message : "Search is empty or not valid type"
        }
    }
    if(z.number().nonnegative().safeParse(rows).success == false) {
        return {
            status : false, 
            code : 400,
            message : "Rows is empty or not valid type"
        }
    }
    if(z.number().nonnegative().safeParse(page).success == false) {
        return {
            status : false, 
            code : 400,
            message : "Page is empty or not valid type"
        }
    }
    return getNotifikasiByDate( tipe as NotifTipe, search, rows, page )
}