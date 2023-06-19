import formidable from "formidable";
import {RecapData, SingleKandidat, addKandidat, editKandidat, hapusKandidat, queryKandidat} from "../controller/kandidat"
import { Router } from "express";
import { AuthMiddleware, CustomRequest } from "../util/auth";

const KandidatRouter = Router();

KandidatRouter.get("/", AuthMiddleware,async (req, res) => {
    const result = await queryKandidat(req.query.search as string)
    return res.status(result.code).json(result)
})


KandidatRouter.get("/recap", AuthMiddleware, async(req, res) => {
    const result = await RecapData()
    return res.status(result.code).json(result)   
})


KandidatRouter.get("/single/:id", AuthMiddleware, async(req,res) => {
    //@ts-ignore
    if(!["super_admin","kandidat_admin","tim_admin", "anggota_admin"].includes(req.auth.role)) return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    const result = await SingleKandidat(parseInt(req.params.id))
    return res.status(result.code).json(result)
})

KandidatRouter.post("/add", AuthMiddleware,async (req,res) => {
    //@ts-ignore
    if(!["super_admin","kandidat_admin"].includes(req.auth.role)) return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    const form = new formidable.IncomingForm()
    form.parse(req, async(err, fields, image) => {
        if(err) {
            return res.status(400).json({message: "Ada masalah pada file", code : 400, status : false})
        }
        console.log(fields)
        const result = await addKandidat(fields as any, image.gambar as formidable.File, (req as CustomRequest).auth.username)
        return res.status(result.code).json(result)
    })
})

KandidatRouter.put("/edit/:id", AuthMiddleware,async (req,res) => {
    //@ts-ignore
    if(!["super_admin","kandidat_admin"].includes(req.auth.role)) return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    const form = new formidable.IncomingForm()

    form.parse(req, async(err, fields, image) => {
        if(err) {
            return res.status(400).json({message: "Ada masalah pada file", code : 400, status : false})
        }
        console.log(fields)
        const result = await editKandidat(parseInt(req.params.id), fields as any, image.gambar as formidable.File, (req as CustomRequest).auth.username)
        return res.status(result.code).json(result)   
        
    })
})

KandidatRouter.delete("/del/:id", AuthMiddleware,async(req,res) => {
    //@ts-ignore
    if(!["super_admin","kandidat_admin"].includes(req.auth.role)) return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    const result = await hapusKandidat(parseInt(req.params.id), (req as CustomRequest).auth.username)
    res.status(result.code).json(result)

})

export default KandidatRouter