import prisma from "../prisma/prisma";
import { IResult } from "../types/Iresult";

export default async function getAllCount() :IResult<{
    kandidat : number,
    tim : number, 
    pemilih : number
}> {
    try {
        const kandidat = await prisma.kandidat.count()
        const tim = await prisma.tim.count()
        const pemilih = await prisma.pemilih.count()

        return {
            status : true,
            code : 200,
            message : "Ok",
            data : {
                kandidat,
                tim, 
                pemilih
            }
        }
    }catch(err) {
        console.log(err)
        return {
            status : false,
            code : 500,
            message : "Server Error"
        }
    }
}