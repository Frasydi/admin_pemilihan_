import { Router } from "express";
import { allAnggota, hapusAnggota, tambahAnggota } from "../controller/anggota";
import { AuthMiddleware } from "../util/auth";

const AnggotaTimRout = Router()

AnggotaTimRout.get("/:id", async(req,res) => {
    const result = await allAnggota(parseInt(req.params.id));
    return res.status(result.code).json(result)
})

AnggotaTimRout.post("/:id", AuthMiddleware,async(req,res) => {
    const result = await tambahAnggota(parseInt(req.params.id), req.body.data);
    return res.status(result.code).json(result)
})

AnggotaTimRout.delete("/", AuthMiddleware, async(req,res) => {
    const result = await hapusAnggota(req.body.data);
    return res.status(result.code).json(result)
})
export default AnggotaTimRout