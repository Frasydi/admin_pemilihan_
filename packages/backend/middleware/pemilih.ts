import { Router } from "express";
import { AllPemilih, addPemilih, changePemilihKandidat, editPemilih, mencariPemilih, removePemilih } from "../controller/pemilih";

const PemilihRouter = Router()

PemilihRouter.get("/", async(req,res) => {
    const result = await AllPemilih(req.query as any)
    return res.status(result.code).json(result)
})

PemilihRouter.post("/add", async(req,res) => {
    console.log(req.body)
    const result = await addPemilih(req.body)
    return res.status(result.code).json(result)   
})

PemilihRouter.delete("/del/:id", async(req,res) => {
    const result = await removePemilih(parseInt(req.params.id))
    return res.status(result.code).json(result)   
})

PemilihRouter.put("/upd/:id", async(req,res) => {
    const result = await editPemilih(parseInt(req.params.id), req.body)
    return res.status(result.code).json(result)   
})

PemilihRouter.put("/memilih/:id", async(req,res) => {
    const result = await changePemilihKandidat(parseInt(req.params.id), req.body.dataId)
    return res.status(result.code).json(result)   
})

PemilihRouter.get("/select/:id", async(req,res) => {
    const result = await mencariPemilih(parseInt(req.params.id), req.query.search as string|| "")
    return res.status(result.code).json(result)
})

export default PemilihRouter