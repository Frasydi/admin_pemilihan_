import { Pemilih } from "@prisma/client";
import { IResult } from "../types/Iresult";
import { IPemilih, IPemilihAdd, ZPemilih, ZPemilihAdd } from "../types/IPemilih";
import { addManyPemilih, delPemilih, getAllPemilih, getAllPendukung, postPemilih, putPemilih, putPemilihKandidat, selectPemilih } from "../service/pemilih";
import { z } from "zod";

export async function AllPemilih(query : IPemilih) : IResult<Pemilih[]> {
    const validation = ZPemilih.safeParse(query)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
        }
    }

    return await getAllPemilih(validation.data)
}

export async function AllPendukung(query : IPemilih) : IResult<Pemilih[]> {
    const validation = ZPemilih.safeParse(query)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
        }
    }
    return await getAllPendukung(validation.data)
}

export async function addPemilih(data : IPemilihAdd, username : string) :IResult<null>{

    const validation = ZPemilihAdd.safeParse(data)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
        }
    }

    return postPemilih(validation.data, username )
}

export async function removePemilih(id : number, username : string) : IResult<null> {
    if(z.number().int().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Id is not a number or int"
        }
    }

    return delPemilih(id, username )
}

export async function editPemilih(id : number, data : IPemilihAdd, username : string) : IResult<null> {
    if(z.number().int().safeParse(id).success === false ) {
        return {
            status : false,
            code :400,
            message : "Id is not a number"
        }
    }

    const validation = ZPemilihAdd.safeParse(data)
    if(validation.success === false) {
        return {
            status : false,
            code : 400,
            message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
        }
    }

    return await putPemilih(id, validation.data, username )
}

export async function changePemilihKandidat(id : number, dataId : number[], username : string) :IResult<null>{
    if(z.number().int().safeParse(id).success === false ) {
        return {
            status : false,
            code :400,
            message : "Id is not a number"
        }
    }
    if(z.array(z.number().int()).safeParse(dataId).success === false ) {
        return {
            status : false,
            code :400,
            message : "Id is not a number"
        }
    
    }
    
    return await putPemilihKandidat(id, dataId, username )
}

export async function mencariPemilih(id : number, search : string) : IResult<Pemilih[]> {
    if(z.number().nonnegative().int().safeParse(id).success === false) return {
        status : false,
        code : 400,
        message : "Invalid id"
    }

    if(z.string().safeParse(search).success == false) return{
        status : false,
        code : 400,
        message : "Invalid search"
    }

    return await selectPemilih(id, search)

}

export async function insertManyPemilih(data : IPemilihAdd[], username : string) :IResult<null> {
    const validation = z.array(ZPemilihAdd.strict()).safeParse(data)
    if(validation.success === false) return {
        status : false,
        code : 400,
        message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
    }

    return await addManyPemilih(data, username )
}