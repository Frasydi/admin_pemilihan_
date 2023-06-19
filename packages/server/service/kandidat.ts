import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';
import { IKandidatAdd } from '../types/IKandidat';
import { deleteFile } from '../util/file';
import { kelurahan } from '../util/dataUtil';
import { createNotifikasi } from './Notifikasi';

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
            include: {
                pemilih: true,
                tim: true
            }
        })

        const newData = data.map(el => {
            return { ...el, pemilih: el.pemilih.length, tim: el.tim.length }
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

export async function postKandidat(data: IKandidatAdd, image: string | null, username : string) {
    try {
        const data2 : any = data
        if(image != null) {
            data2.gambar = image
        }
        const result = await prisma.kandidat.create({
            data: data2
        })

        await createNotifikasi(`Kandidat ${result.nama} berhasil ditambahkan, oleh ${username}`)

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

export async function putKandidat(id: number, data: IKandidatAdd, gambar: string | null, username : string) {
    try {
        const data2 : any = data
        if(gambar != null) {
            data2.gambar = gambar
        }
        const fet = await prisma.kandidat.update({
            where: { id },
            data: data2
        })

        await createNotifikasi(`Kandidat ${fet.nama} berhasil diubah, oleh ${username}`)

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

export async function getSingleKandidat(id: number) {
    try {
        const result = await prisma.kandidat.findFirst({
            where: {
                id
            },
            include: {
                pemilih: true,
                tim: true
            }
        })
        if (result == null) {
            return {
                status: false,
                code: 404,
                message: "Not Found"
            }
        }
        return {
            status: true,
            message: "Ok",
            code: 200,
            data: {
                ...result,
                pemilih: result?.pemilih.length,
                tim: result?.tim.length,
            }
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            message: "Server Error",
            code: 500
        }
    }
}

export async function delKandidat(id: number, username : string) {
    try {
        const result = await prisma.kandidat.delete({
            where: {
                id
            }
        })
        deleteFile(result.gambar || "")

        await createNotifikasi(`Kandidat ${result.nama} berhasil dihapus, oleh ${username}`)
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

export async function DataRecap() {
    try {
        const kandidat = await prisma.kandidat.findMany({
            select: {
                id: true,
                nama: true,
                _count : {
                    select : {
                        pemilih : true
                    }
                },
                pemilih: {
                    
                    select: {
                        
                        kecamatan: true,
                        kelurahan: true
                    },
                },
            },
        });

        let countData = 0;
        const groupedKecamatan: { [key: string]: Array<{x : string, y : number}> } = {};
        const groupedKelurahan: { [key: string]: Array<{x : string, y : number}> } = {};
        const groupKandidat : { x : string, y : number}[] = []
        const countKecamatan : {[key : string]: any} = {}
        const countKelurahan : {[key : string]: any} = {}
        kandidat.forEach((kand) => {
            groupKandidat.push({x : kand.nama, y : kand._count.pemilih})
            countData+=kand._count.pemilih
            countKecamatan[kand.nama] = {}
            countKelurahan[kand.nama] = {}
            
            kelurahan.forEach(el => {
                countKecamatan[kand.nama][el.kecamatan] = 0

                el.kelurahan.forEach(el2 => {
                    countKelurahan[kand.nama][el2] = 0
                })
            })
            kand.pemilih.forEach((pemilih) => {
                const { kecamatan, kelurahan } = pemilih;
                if (groupedKecamatan[kand.nama] == null) {
                    groupedKecamatan[kand.nama] = []
                }
                if (groupedKelurahan[kand.nama] == null) {
                    groupedKelurahan[kand.nama] = []
                }
                countKecamatan[kand.nama][kecamatan]++
                countKelurahan[kand.nama][kelurahan]++
                

                const indexOfKecamatan = groupedKecamatan[kand.nama].findIndex((el) => el.x == kecamatan) 
                const indexOfKelurahan = groupedKelurahan[kand.nama].findIndex((el) => el.x == kelurahan) 

                if(indexOfKecamatan == -1) {
                    groupedKecamatan[kand.nama].push({
                        x : kecamatan,
                        y : 1
                    })
                } else {
                    groupedKecamatan[kand.nama][indexOfKecamatan].y++
                }

                if(indexOfKelurahan == -1) {
                    groupedKelurahan[kand.nama].push({
                        x : kelurahan,
                        y : 1
                    })
                } else {
                    groupedKelurahan[kand.nama][indexOfKelurahan].y++
                }

            });
        });
        const result = {
            kandidat : groupKandidat,
            countData : countData,
            kecamatan : groupedKecamatan,
            kelurahan : groupedKelurahan,
            countKecamatan,
            countKelurahan
        }
        return {
            status : true,
            code : 200,
            message : "Ok",
            data : result
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            code: 500,
            message: "server error"
        }
    }
}