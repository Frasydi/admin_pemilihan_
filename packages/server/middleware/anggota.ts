import { Router } from "express";
import { allAnggota, hapusAnggota, tambahAnggota } from "../controller/anggota";
import { AuthMiddleware, CustomRequest } from "../util/auth";

const AnggotaTimRout = Router()

AnggotaTimRout.get("/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "anggota_admin", "tim_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await allAnggota(parseInt(req.params.id));
    return res.status(result.code).json(result)
})

AnggotaTimRout.post("/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "anggota_admin", "tim_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await tambahAnggota(parseInt(req.params.id), req.body.data, (req as CustomRequest).auth.username);
    return res.status(result.code).json(result)
})

AnggotaTimRout.delete("/", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "anggota_admin", "tim_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await hapusAnggota(req.body.data, (req as CustomRequest).auth.username);
    return res.status(result.code).json(result)
})
export default AnggotaTimRout