import prisma from "../prisma/prisma";

export async function getNotifikasi() {
    try {
        const result = await prisma.notifikasi.findMany({
            orderBy : {
                created_at : "desc"
            },
            take : 10
        })
        return {
            status : true,
            code : 200,
            message : "OK",
            data : result
        }
    } catch (err) {
        console.log(err)
        return {
            status : true,
            code : 500,
            message : "Server Error",

        }
    }
}

export async function createNotifikasi(isi : string) {
    try {
        await prisma.notifikasi.create({
            data : {
                isiNotifikasi : isi
            }
        })
    }catch(err) {
        console.log(err)

    }
}