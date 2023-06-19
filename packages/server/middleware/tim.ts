import { Router } from "express";
import { KecamatanTim, KelurahanTim, addTim, editTim, removeTim } from "../controller/tim";
import { putTim } from "../service/tim";
import { AuthMiddleware, CustomRequest } from "../util/auth";

const TimRouter = Router()

TimRouter.get("/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "tim_admin", "anggota_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await KecamatanTim(parseInt(req.params.id), req.query.search as string || "")
    return res.status(result.code).json(result)
})

TimRouter.post("/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "tim_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await addTim(parseInt(req.params.id), req.body, (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})

TimRouter.get("/:id/:kecamatan", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "tim_admin", "anggota_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })

    const result = await KelurahanTim(parseInt(req.params.id), req.params.kecamatan, req.query.search as string || "")
    return res.status(result.code).json(result)
})

TimRouter.delete("/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "tim_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await removeTim(parseInt(req.params.id), (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})


TimRouter.put("/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin", "kandidat_admin", "tim_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })

    const result = await editTim(parseInt(req.params.id), req.body, (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})


export default TimRouter