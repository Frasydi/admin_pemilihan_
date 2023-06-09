import { z } from "zod";
import { DataRecap, delKandidat, getKandidatSearch, getSingleKandidat, postKandidat, putKandidat } from "../service/kandidat";
import { IResult } from "../types/Iresult";
import { kandidat } from "@prisma/client";
import { IKandidatAdd, ZKandidatAdd } from "../types/IKandidat";
import formidable from "formidable";
import { saveFile } from "../util/file";

export async function queryKandidat(search : string) : IResult<(kandidat & {tim : number, pemilih : number})[]> {
    if(z.string().optional().safeParse(search).success === false) {
        return {
            message : "Invalid search",
            code : 400,
            status : false
        }
    }

    return await getKandidatSearch(search)
}


export async function SingleKandidat(id : number) : IResult<kandidat & {tim : number, pemilih : number}> {
    if(z.number().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Invalid search"
        }
    }

    return await getSingleKandidat(id)
}

export async function addKandidat(data : IKandidatAdd, image : formidable.File) : IResult<null> {
    const validation = ZKandidatAdd.safeParse(data)
    if(validation.success === false) {
        return {
            code : 400,
            message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
            status : false
        }
    }
    
    let imageName 
    if(image != null) {
        imageName = await saveFile(image.originalFilename || "", image.filepath || "")
    }

    return postKandidat(validation.data, imageName)
}

export async function editKandidat(id : number, data : IKandidatAdd, gambar : formidable.File) : IResult<null> {
    if(z.number().safeParse(id).success === false) {
        return {
            code : 200,
            message : "Id is required",
            status : false
        }
    }
    const validation = ZKandidatAdd.safeParse(data)
    console.log(data)
    if(validation.success === false) {
        return {
            code : 400,
            message : validation.error.issues[0].path + " : "+ validation.error.issues[0].message,
            status : false
        }
    }
    let imageName 
    if(gambar != null) {
        imageName = await saveFile(gambar.originalFilename || "", gambar.filepath || "")
    }
    return await putKandidat(id, validation.data, imageName)
}

export async function hapusKandidat(id : number) : IResult<null> {
    if(z.number().nonnegative().safeParse(id).success === false) {
        return {
            status : false,
            code : 400,
            message : "Invalid Id" 
        }
    }

    return await delKandidat(id)
}

export async function RecapData() :IResult<any> {
    return await DataRecap()
}