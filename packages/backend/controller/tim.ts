import { Prisma, Tim } from "@prisma/client";
import { IResult } from "../types/Iresult";
import { z } from "zod";
import { delTim, getKecamatanTim, getKelurahanTim, pushTim, putTim } from "../service/tim";
import { ITimAdd, ZTimAdd } from "../types/ITim";
import { ZKandidatAdd } from "../types/IKandidat";

export async function KecamatanTim(kandidatId : number, search : string) : IResult<(Prisma.PickArray<Prisma.TimGroupByOutputType, "kecamatan"[]> & {})[]> {
    if(z.number().int().safeParse(kandidatId).success === false) {
        return {
            status : false,
            code : 400,
            message : "Kandidat tidak ditemukan"
        }
    }
    if(z.string().optional().safeParse(search).success == false) {
        return {
            status : false,
            code : 400,
            message : "Search is not string"
        }
    }
    return await getKecamatanTim(kandidatId, search)
}

export async function addTim(id : number, data : ITimAdd) {
    if(z.number().int().nonnegative().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Id is not a number"
        }
    }
    const validation = ZTimAdd.safeParse(data)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : validation.error.issues[0].path + validation.error.issues[0].message
        }
    }

    return await pushTim(id , validation.data)
}

export async function KelurahanTim(id : number, kecamatan : string, search : string) :IResult<Tim[]>{
    if(z.number().nonnegative().int().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Id is not a number"
        }
    }
    if(z.string().nonempty().safeParse(kecamatan).success === false) {
        return {
            status : false,
            code : 400,
            message : "Kecamatan is not a string"
        }
    }
    if(z.string().safeParse(search).success === false) {
        return {
            status : false,
            code : 400,
            message : "Search is not a string"
        }
    }
    return await getKelurahanTim(id, kecamatan, search)
}

export async function removeTim(id : number) {
    if(z.number().nonnegative().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Id is not a number"
        }
    }

    return await delTim(id)
}

export async function editTim(id : number, data : ITimAdd) :IResult<null> {
    if(z.number().int().nonnegative().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Id is not a number"
        }
    }
    const validation = ZTimAdd.safeParse(data)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : validation.error.issues[0].path + validation.error.issues[0].message
        }
    }

    return await putTim(id , validation.data)
}
