import { NotifTipe } from "@prisma/client";
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

export async function getNotifikasiByDate(tipe: NotifTipe, search: string = "", rows: number, page: number) {
    try {
        const count = await prisma.notifikasi.count({
            where: {

                searchId: {
                    contains: search
                },
                tipe: tipe
            }
        })
        const result = await prisma.notifikasi.findMany({
            where: {

                searchId: {
                    contains: search
                },
                tipe: tipe
            },
            orderBy: {
                created_at: "desc"
            },
            skip: page * rows,
            take: rows,
        })
        return {
            status: true,
            code: 200,
            message: "OK",
            data: {notifs : result, _count : count}
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

export async function createNotifikasiWithLocation(searchId: string, isi: string, lat: number, long: number) {
    try {
        await prisma.notifikasi.create({
            data: {
                isiNotifikasi: isi,
                lat,
                long,
                tipe: "PENDUKUNG",
                searchId: searchId
            }
        })
    } catch (err) {
        console.log(err)

    }
}

export async function createNotifikasi(tipe: NotifTipe, searchId: string, isi: string) {
    try {
        await prisma.notifikasi.create({
            data: {
                isiNotifikasi: isi,
                tipe,
                searchId
            }
        })
    } catch (err) {
        console.log(err)

    }
}