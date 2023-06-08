import { Anggota_Tim } from "@prisma/client";
import { IResult } from "../types/Iresult";
import { z } from "zod";
import { delAnggota, getAllAnggota, pushAnggota } from "../service/anggota";

export async function allAnggota(id : number) : IResult<Anggota_Tim[]> {
    if(z.number().nonnegative().int().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Invalid id"
        }
    }

    return await getAllAnggota(id)
}

export async function tambahAnggota(id : number, data : number[]) : IResult<null> {
    if(z.number().nonnegative().int().safeParse(id).success === false) return {
        status : false,
        code : 400,
        message : "Invalid id"
    }
    const validation = z.array(z.number().nonnegative().int()).safeParse(data)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : "Data not valid"
        }
    }
    console.log(data)
    return await pushAnggota(id, validation.data)
}

export async function hapusAnggota(data : number[]) {
    
    const validation = z.array(z.number().nonnegative().int()).safeParse(data)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : "Data not valid"
        }
    }
    console.log(data)
    return await delAnggota(validation.data)
}
