import { z } from "zod";

export const ZPemilih = z.object({
    nkk : z.string(),
    nik : z.string(),
    nama : z.string(),
    jenis_kelamin : z.enum(["L", "P","Semua"]),
    kelurahan : z.string(),
    kecamatan : z.string(),
    kandidatId : z.preprocess((val : any) => parseInt(val), z.number().int().optional()).optional(),
})

export type IPemilih = z.infer<typeof ZPemilih>

export const ZPemilihAdd = z.object({
    nkk : z.string().nonempty(),
    nik : z.string().nonempty(),
    nama : z.string().nonempty(),
    alamat : z.string().nonempty(),
    tempat_lahir : z.string().nonempty(),
    sts_kawin : z.enum(["SUDAH_MENIKAH", "BELUM_MENIKAH"]),
    jenis_kelamin : z.enum(["L", "P"]),
    kelurahan : z.string().nonempty(),
    kecamatan : z.string().nonempty(),
    rt : z.string().nonempty(),
    rw : z.string().nonempty(),
    tps : z.string(),
    no_hp : z.string().optional()
})

export const ZPemilihMemilih = z.object({
    location : z.object({latitude : z.number(), longitude : z.number()}),
    dataId : z.array(z.number().int())
})

export type IPemilihMemilih = z.infer<typeof ZPemilihMemilih>

export type IPemilihAdd = z.infer<typeof ZPemilihAdd>