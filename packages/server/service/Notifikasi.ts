import prisma from "../prisma/prisma";

export async function getNotifikasi() {
    try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const result = await prisma.notifikasi.findMany({
            where: {
                created_at: {
                    gte: yesterday,
                    lte: tomorrow,
                }
            },
            orderBy: {
                created_at: "desc"
            },
            take: 10
        })
        return {
            status: true,
            code: 200,
            message: "OK",
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: true,
            code: 500,
            message: "Server Error",

        }
    }
}

export async function getNotifikasiByDate(date: number) {
    try {
        const today = new Date();
        today.setDate(date);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const result = await prisma.notifikasi.findMany({
            where: {
                created_at: {
                    gte: yesterday,
                    lte: tomorrow,
                }
            },
            orderBy: {
                created_at: "desc"
            }
        })
        return {
            status: true,
            code: 200,
            message: "OK",
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: true,
            code: 500,
            message: "Server Error",

        }
    }
}

export async function createNotifikasiWithLocation(isi: string, lat : number, long : number) {
    try {
        await prisma.notifikasi.create({
            data: {
                isiNotifikasi: isi,
                lat,
                long
            }
        })
    } catch (err) {
        console.log(err)

    }
}

export async function createNotifikasi(isi: string) {
    try {
        await prisma.notifikasi.create({
            data: {
                isiNotifikasi: isi
            }
        })
    } catch (err) {
        console.log(err)

    }
}