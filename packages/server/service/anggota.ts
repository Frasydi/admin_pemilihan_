import { Pemilih } from "@prisma/client"
import prisma from "../prisma/prisma"

export async function getAllAnggota(id : number) {
    try {
        const result = await prisma.anggota_Tim.findMany({
            where : {
                tim_id : id,
            },
            include : {
                pemilih : true
            }
        })
        const newResult = result.map(el => {
            const {pemilih, ...rest} = el
            return {
                ...pemilih,
                ...rest,
            }
        })
        return {
            code : 200,
            message : "Ok",
            status : true,
            data : newResult
        }
    }catch(err) {
        console.log(err)
        return {
            status : false,
            code : 500,
            message : "Server error"
        }
    }
}

export async function pushAnggota(id : number, data : number[]) {
    try {
        const newData = data.map(el => ({
            pemilih_id : el,
            tim_id : id
        }))
        await prisma.anggota_Tim.createMany({
            data : newData
        })

        return {
            status : true,
            code : 200,
            message : "Ok"
        }
    }catch(err) {
        console.log(err)
        return {
            status : false,
            code : 500,
            message : "Server error"
        }
    }
}

export async function delAnggota(data : number[]) {
    try {
        
        const promise = data.map(async(dat) => {
            await prisma.anggota_Tim.delete({
                where : {
                    id : dat
                }
            })
        })
        await Promise.all(promise)
        return {
            status : true,
            code : 200,
            message : "Ok"
        }
    }catch(err) {
        console.log(err)
        return {
            status : false,
            code : 500,
            message : "Server error"
        }
    }
}