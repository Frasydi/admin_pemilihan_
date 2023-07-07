import { Pemilih, Prisma } from "@prisma/client";
import { IPemilih, IPemilihAdd } from "../types/IPemilih";
import { IResult } from "../types/Iresult";
import prisma from "../prisma/prisma";
import { createNotifikasi } from "./Notifikasi";

export async function getAllPemilih(query: IPemilih, kelurahan : string): IResult<Pemilih[]> {
    try {
        const { jenis_kelamin, ...data }: any = query
        let option: any = {}
        Object.keys(data).forEach((el: any) => {
            option[el] = {
                contains: data[el]
            }
        })
        if(kelurahan != "all") {
            option.kelurahan = kelurahan
        }
        if (jenis_kelamin != "Semua") {
            option.jenis_kelamin = jenis_kelamin
        }
        console.log(option.jenis_kelamin)
        const result = await prisma.pemilih.findMany({
            where: option,
            include: {
                kandidat: {
                    select: {
                        id: true,
                        nama: true
                    }
                }
            }
        })

        return {
            status: true,
            code: 200,
            message: "Ok",
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            message: "Server Error",
            code: 500,
            status: false
        }
    }
}

export async function postPemilih(data: IPemilihAdd, username : string) {
    try {
        await prisma.pemilih.create({
            data
        })
        await createNotifikasi(`Pemilih dengan nik ${data.nik} berhasil ditambahkan oleh ${username}`)
        return {
            status: true,
            code: 200,
            message: "Ok"
        }
    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code == "P2002") {
                return {
                    status: false,
                    code: 400,
                    message: "Nik or Nkk is already taken"
                }
            }
            return {
                status: false,
                code: 400,
                message: "Invalid"
            }
        }
        return {
            status: false,
            code: 500,
            message: "Server Error",
        }
    }
}

export async function delPemilih(id: number, username : string) {
    try {
        const result = await prisma.pemilih.delete({
            where: {
                id
            }
        })
        await createNotifikasi(`Pemilih dengan nik ${result.nik} berhasil dihapus oleh ${username}`)
        return {
            status: true,
            code: 200,
            message: "Ok"
        }
    } catch (err) {
        console.log(err)

        return {
            status: false,
            code: 500,
            message: "Server Error",
        }
    }
}

export async function putPemilih(id: number, data: IPemilihAdd, username : string) {
    try {
        const result = await prisma.pemilih.update({
            where: {
                id
            },
            data: data
        })
        await createNotifikasi(`Pemilih dengan nik ${result.nik} berhasil diubah oleh ${username}`)
        return {
            status: true,
            code: 200,
            message: "Ok"
        }
    } catch (err) {
        console.log(err)

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return {
                    status: false,
                    code: 400,
                    message: "Nik or nkk is already taken"
                }
            }
        }
        return {
            status: false,
            code: 500,
            message: "Server Error",
        }
    }
}

export async function putPemilihKandidat(kandidatId: number, dataId: number[], username : string) {
    try {
        const promise = dataId.map(async (id) => {
            try {
                await prisma.pemilih.update({
                    where: {
                        id
                    },
                    data: {
                        kandidat: {
                            connect: {
                                id: kandidatId
                            }
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
        await Promise.all(promise)
        await createNotifikasi(`Pemilih dengan id ${dataId} berhasil dihubungkan dengan kandidat ${kandidatId} oleh ${username}`)
        return {
            status: true,
            code: 200,
            message: "Ok"
        }
    }
    catch (err) {
        console.log(err)
        return {
            status: false,
            code: 500,
            message: "Server Error",
        }
    }
}

export async function selectPemilih(id: number, search: string) {
    try {

        const result = await prisma.pemilih.findMany({
            where: {
                AND: [
                    {
                     anggota_tim : null
                
                    },
                    {

                        OR: [
                            {
                                nama: {
                                    contains: search
                                }
                            },
                            {
                                nik: {
                                    contains: search
                                }
                            },
                            {
                                kecamatan: {
                                    contains: search
                                }
                            },
                            {
                                kelurahan: {
                                    contains: search
                                }
                            },
                        ]
                    }

                ]

            }


        })

        return {
            status: true,
            code: 200,
            message: "Ok",
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            code: 500,
            message: "Server Error",
        }
    }
}

export async function addManyPemilih(pemilih : IPemilihAdd[], username : string) {
    try {

        const promises = pemilih.map(async(el) => {
            try {

                const result = await prisma.pemilih.create({
                    data : el
                })
                return result
            }catch(err) {
                console.log(err)
            }
        })

        await Promise.all(promises)

        await createNotifikasi(`Pemilih yang berjumlah ${pemilih.length} berhasil ditambahkan oleh ${username}`)
        
        return {
            status : true,
            code : 200,
            message : "Ok"
        }
    }catch(err) {
        console.log(err)
        return {
            status : false,
            code : 200,
            message : "Server error"
        }
    }
}

export async function getAllPendukung(query : IPemilih) {
    try {
        const {jenis_kelamin, kandidatId, ...quer} : any = query
        const where : any = {
            
        }

        Object.keys(quer).forEach((el : any) => {
            if(quer[el] != null) {
                where[el] = {
                    contains : quer[el]
                }
            }
        })
        if(jenis_kelamin != "Semua") {
            where.jenis_kelamin = jenis_kelamin
        }
        if(kandidatId != null &&  kandidatId >= 0) {
            where.kandidatId = kandidatId
        } else {
            where.NOT = {
                kandidatId : null
            }
        }
        const result = await prisma.pemilih.findMany({
            where 
        })

        return {
            status : true,
            code : 200,
            message : "Ok",
            data : result
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