import { z } from "zod";
import { IResult } from "../types/Iresult";
import { getNotifikasi, getNotifikasiByDate } from "../service/Notifikasi";
import { notifikasi } from "@prisma/client";


export async function findNotifikasi() :IResult<notifikasi[]>{
    
    return await getNotifikasi()

}

export async function NotifikasiByDate(date : number) : IResult<notifikasi[]> {
    if(!z.number().int().safeParse(date).success) {
        return {
            status : false,
            code : 400,
            message : "Date is not a number"
        }
    }
    return getNotifikasiByDate(date)
}