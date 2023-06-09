import { Router } from "express";
import getAllCount from "../service/all";

const UtilRouter = Router()

UtilRouter.get("/", async(req,res) => {
    const result = await getAllCount()
    return res.status(result.code).json(result)
})

export default UtilRouter