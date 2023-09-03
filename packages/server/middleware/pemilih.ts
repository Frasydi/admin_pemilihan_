import { Router } from "express";
import { AllPemilih, AllPendukung, addPemilih, changePemilihKandidat, editPemilih, gantiNomorHP, insertManyPemilih, mencariPemilih, removePemilih } from "../controller/pemilih";
import { AuthMiddleware, CustomRequest } from "../util/auth";

const PemilihRouter = Router()

PemilihRouter.get("/", AuthMiddleware, async (req, res) => {
    const user = (req as CustomRequest).auth
    //@ts-ignore
    if (!["super_admin", "pemilihan_admin"].includes(user.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await AllPemilih(req.query as any, user.kelurahan || "all")
    return res.status(result.code).json(result)
})

PemilihRouter.post("/add", AuthMiddleware, async (req, res) => {

    //@ts-ignore
    if (!["super_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    console.log(req.body)
    const result = await addPemilih(req.body, (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})

PemilihRouter.delete("/del/:id", AuthMiddleware, async (req, res) => {//@ts-ignore
    if (!["super_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })

    const result = await removePemilih(parseInt(req.params.id), (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})

PemilihRouter.put("/upd/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await editPemilih(parseInt(req.params.id), req.body, (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})

PemilihRouter.put("/memilih/:id", AuthMiddleware, async (req, res) => {//@ts-ignore
    if (!["super_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })

    const result = await changePemilihKandidat(parseInt(req.params.id), req.body, (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})

PemilihRouter.get("/select/:id", AuthMiddleware, async (req, res) => {
    
    const result = await mencariPemilih(parseInt(req.params.id), req.query.search as string || "")
    return res.status(result.code).json(result)
})

PemilihRouter.post("/many", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if (!["super_admin"].includes(req.auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await insertManyPemilih(req.body, (req as CustomRequest).auth.username)
    return res.status(result.code).json(result)
})

PemilihRouter.get("/pendukung", AuthMiddleware, async (req, res) => {
    if (!["super_admin", "pemilihan_admin"].includes((req as CustomRequest).auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await AllPendukung(req.query as any)
    return res.status(result.code).json(result)
})

PemilihRouter.put("/noHp/:nkk", AuthMiddleware, async (req, res) => {
    if (!["super_admin", "pemilihan_admin"].includes((req as CustomRequest).auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const result = await gantiNomorHP(req.body.noHP,req.params.nkk )
    return res.status(result.code).json(result)
})

export default PemilihRouter