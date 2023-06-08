import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';
import { IKandidatAdd } from '../types/IKandidat';
import { deleteFile } from '../util/file';

export async function getKandidatSearch(search: string) {
    try {
        const data = await prisma.kandidat.findMany({
            where: {
                OR: [
                    {

                        nama: {
                            contains: search
                        },
                    },
                    {

                        nik: {
                            contains: search
                        },
                    },
                    {

                        alamat: {
                            contains: search
                        }
                    }
                ]
            },
            include : {
                pemilih : true,
                tim : true
            }
        })

        const newData = data.map(el => {
            return {...el, pemilih : el.pemilih.length, tim : el.tim.length}
        })

        return {
            message: "OK",
            code: 200,
            data: newData,
            status: true
        }
    } catch (err) {
        console.log(err)
        return {
            message: "Error",
            code: 500,
            status: false
        }
    }
}

export async function postKandidat(data: IKandidatAdd, image?: string | null) {
    try {
        const result = await prisma.kandidat.create({
            data: { ...data, gambar: image }
        })
        return {
            code: 200,
            message: "OK",
            status: true
        }
    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message: "NIK is included",
                    status: false
                }
            }
            return {
                code: 400,
                message: err.message,
                status: false
            }
        }
        return {
            status: false,
            code: 500,
            message: "Server Error"
        }
    }
}

export async function putKandidat(id: number, data: IKandidatAdd, gambar?: string | null) {
    try {
        const fet = await prisma.kandidat.update({
            where: { id },
            data: { ...data, gambar }
        })
        return {
            status: false,
            code: 200,
            message: 'Success'
        }
    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return {
                    status: false,
                    message: "NIK is already taken",
                    code: 400
                }
            }
            return {
                status: false,
                message: err.message,
                code: 400
            }
        }
        return {
            status: false,
            code: 500,
            message: "Server Error"
        }
    }
}

export async function getSingleKandidat(id : number) {
    try {
        const result = await prisma.kandidat.findFirst({
            where : {
                id 
            },
            include : {
                pemilih : true,
                tim : true
            }
        })
        if(result == null) {
            return {
                status : false,
                code : 404,
                message : "Not Found"
            }
        }
        return {
            status : true,
            message : "Ok",
            code : 200,
            data : {
                ...result,
                pemilih : result?.pemilih.length,
                tim : result?.tim.length,
            }
        }
    }catch(err) {
        console.log(err)
        return {
            status: false,
            message : "Server Error",
            code : 500
        }
    }
}

export async function delKandidat(id: number) {
    try {
        const result = await prisma.kandidat.delete({
            where: {
                id
            }
        })
        deleteFile(result.gambar || "")
        return {
            status: true,
            code: 200,
            message: "Berhasil Hapus"
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            code: 500,
            message: "Server Error"
        }
    }
}