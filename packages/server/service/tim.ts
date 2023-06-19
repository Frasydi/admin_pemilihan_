import { Prisma } from "@prisma/client"
import prisma from "../prisma/prisma"
import { IKandidatAdd } from "../types/IKandidat"
import { ITimAdd } from "../types/ITim"
import { createNotifikasi } from "./Notifikasi"

export async function getKecamatanTim(kandidatID: number, search : string) {
    try {
        const result = await prisma.tim.groupBy({
            by: ["kecamatan"],
            where: {
                kandidatId: kandidatID,
                kecamatan : {
                    contains : search
                }
            },
            orderBy : {
                kecamatan : "asc"
            },
            _count : {
                kecamatan : true
            }
        })
        if (result.length == 0) {
            return {
                status: false,
                code: 404,
                message: "Kandidat tidak ditemukan"
            }
        }
        const newResult = result.map(el => ({
            ...el,
            _count : el._count.kecamatan
        }))
        return {
            status: true,
            code: 200,
            data: newResult,
            message: "OK"
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            code: 500,
            message: "Server error"
        }
    }
}

export async function pushTim(id : number, data: ITimAdd, username : string) {
    try {
       
        await prisma.tim.create({
            data : {
                ...data,
                kandidat : {
                    connect : {
                        id : id
                    }
                }
            }
        })

        await createNotifikasi(`Tim ${data.nama} berhasil ditambahkan oleh ${username}`)

        return {
            status : true,
            code : 200,
            message : "Success"
        }
    } catch (err) {
        console.log(err)
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code == "P2002") {
                return {
                    status : false,
                    code : 400,
                    message : "Nama is already registered"
                }
            }
            if(err.code == "P2025") {
                return {
                    status : false,
                    code : 404,
                    message : "Not Found Kandidat"
                }
            }
            return {
                status : false,
                code : 400,
                message : "Error"
            }
        }
        return {
            status: false,
            code: 500,
            message: "Server error"
        }
    }
}


export async function putTim(id : number, data: ITimAdd, username : string) {
    try {
       
        await prisma.tim.update({
            where : {
                id : id,
            },
            data : {
                ...data
            }
        })
        await createNotifikasi(`Tim ${data.nama} berhasil diubah, oleh ${username}`)

        return {
            status : true,
            code : 200,
            message : "Success"
        }
    } catch (err) {
        console.log(err)
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code == "P2002") {
                return {
                    status : false,
                    code : 400,
                    message : "Nama is already registered"
                }
            }
            if(err.code == "P2025") {
                return {
                    status : false,
                    code : 404,
                    message : "Not Found Kandidat"
                }
            }
            return {
                status : false,
                code : 400,
                message : "Error"
            }
        }
        return {
            status: false,
            code: 500,
            message: "Server error"
        }
    }
}




export async function getKelurahanTim(id : number, kecamatan : string, search : string) {
    try {
        const result = await prisma.tim.findMany({
            where : {
                kandidatId : id,
                kecamatan : kecamatan,
                nama : {
                    contains : search
                }
            },
            orderBy : {
                nama : "asc"
            },
            include : {
                _count : true
            }
        })
        if(result.length == 0) return{
            status : false,
            code : 404,
            message : "Not Found"
        }
        const newResult = result.map(el => ({
            ...el,
            _count : el._count.anggota_tim
        }))
        return {
            status : true,
            code : 200,
            message : "Success",
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

export async function delTim(id : number, username : string) {
    try {
        const result = await prisma.tim.delete({
            where : {
                id
            }
        })
        await createNotifikasi(`${username} menghapus tim ${result.nama}`)
        return {
            status : true,
            code : 200,
            message : "Delete Tim"
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