import { Router } from "express";
import { KecamatanTim, KelurahanTim, addTim, removeTim } from "../controller/tim";
import { putTim } from "../service/tim";
import { AuthMiddleware } from "../util/auth";

const TimRouter = Router()

TimRouter.get("/:id", AuthMiddleware,async (req, res) => {
    const result = await KecamatanTim(parseInt(req.params.id), req.query.search as string || "")
    return res.status(result.code).json(result)   
})

TimRouter.post("/:id", AuthMiddleware,async(req,res) => {
    const result = await addTim(parseInt(req.params.id), req.body)
    return res.status(result.code).json(result)
})

TimRouter.get("/:id/:kecamatan", AuthMiddleware,async (req, res) => {
    const result = await KelurahanTim(parseInt(req.params.id), req.params.kecamatan, req.query.search as string || "")
    return res.status(result.code).json(result)  
})

TimRouter.delete("/:id", AuthMiddleware,async (req, res) => {
    const result = await removeTim(parseInt(req.params.id))   
    return res.status(result.code).json(result)
})


TimRouter.put("/:id", AuthMiddleware,async (req, res) => {
    const result = await putTim(parseInt(req.params.id), req.body)
    return res.status(result.code).json(result)
})


export default TimRouter