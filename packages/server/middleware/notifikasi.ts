import { Router } from "express";
import { NotifikasiByDate, findNotifikasi } from "../controller/Notifikasi";
import { AuthMiddleware, CustomRequest } from "../util/auth";

const NotifikasiRout = Router();

NotifikasiRout.get("/", AuthMiddleware,async(req,res) => {
    if (!["super_admin"].includes((req as CustomRequest).auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(clientIp)
    const result = await findNotifikasi();
    return res.status(result.code).json(result)
})

NotifikasiRout.get("/:date", AuthMiddleware, async(req,res) => {
    if (!["super_admin"].includes((req as CustomRequest).auth.role)) return res.status(403).json({
        message: "You are not allowed to access this",
        code: 403,
        status: false
    })
    console.log(req.params.date)
    const result = await NotifikasiByDate(parseInt(req.params.date));
    return res.status(result.code).json(result)
})

export default NotifikasiRout