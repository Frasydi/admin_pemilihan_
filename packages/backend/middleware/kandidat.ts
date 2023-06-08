import formidable from "formidable";
import {SingleKandidat, addKandidat, editKandidat, hapusKandidat, queryKandidat} from "../controller/kandidat"
import { Router } from "express";
import { AuthMiddleware } from "../util/auth";

const KandidatRouter = Router();

KandidatRouter.get("/", AuthMiddleware,async (req, res) => {
    const result = await queryKandidat(req.query.search as string)
    return res.status(result.code).json(result)
})

KandidatRouter.get("/:id", AuthMiddleware, async(req,res) => {
    const result = await SingleKandidat(parseInt(req.params.id))
    return res.status(result.code).json(result)
})

KandidatRouter.post("/add", AuthMiddleware,async (req,res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, async(err, fields, image) => {
        if(err) {
            return res.status(400).json({message: "Ada masalah pada file", code : 400, status : false})
        }
        console.log(fields)
        const result = await addKandidat(fields as any, image.gambar as formidable.File)
        return res.status(result.code).json(result)
    })
})

KandidatRouter.put("/edit/:id", AuthMiddleware,async (req,res) => {

    const form = new formidable.IncomingForm()

    form.parse(req, async(err, fields, image) => {
        if(err) {
            return res.status(400).json({message: "Ada masalah pada file", code : 400, status : false})
        }
        console.log(fields)
        const result = await editKandidat(parseInt(req.params.id), fields as any, image.gambar as formidable.File)
        return res.status(result.code).json(result)   
        
    })
})

KandidatRouter.delete("/del/:id", AuthMiddleware,async(req,res) => {
    const result = await hapusKandidat(parseInt(req.params.id))
    res.status(result.code).json(result)

})

export default KandidatRouter