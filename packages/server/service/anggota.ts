import { Pemilih } from "@prisma/client"
import prisma from "../prisma/prisma"
import { createNotifikasi } from "./Notifikasi"

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

export async function pushAnggota(id : number, data : number[], username : string) {
    try {
        let countAnggota = await prisma.anggota_Tim.count({
            where : {
                tim_id : id
            }
        })
        console.log(countAnggota)
        console.log(data.length)
        if(countAnggota + data.length > 2) {
            return {
                status : false,
                code : 400,
                message : "Tidak bisa menambahkan lebih dari dua anggota"
            }
        }
        const newData = data.map(el => ({
            pemilih_id : el,
            tim_id : id
        }))
        const hasil = await prisma.anggota_Tim.createMany({
            data : newData
        })

        createNotifikasi("ADMIN",id.toString(),` menambahkan ${data.length} anggota pada tim ${id}`)

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

export async function delAnggota(data : number[], username : string) {
    try {
        
        const promise = data.map(async(dat) => {
            await prisma.anggota_Tim.delete({
                where : {
                    id : dat
                }
            })
        })
        await Promise.all(promise)

        await createNotifikasi("ADMIN",data[0].toString(),`${username} menghapus ${data.length} anggota pada tim ${data[0]}`)

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