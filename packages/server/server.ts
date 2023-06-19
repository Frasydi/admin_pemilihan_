import dotenv from "dotenv"
dotenv.config()
import express, { Request, Router } from 'express';
import KandidatRouter from './middleware/kandidat';
import UserRouter from './middleware/user';
import cookieParser from "cookie-parser";
import { z } from "zod";
import path from "path";
import PemilihRouter from "./middleware/pemilih";
import TimRouter from "./middleware/tim";
import UtilRouter from "./middleware/util";
import AnggotaTimRout from "./middleware/anggota";
import prisma from "./prisma/prisma";
import { Register } from "./controller/user";
import NotifikasiRout from "./middleware/notifikasi";

(async () => {
    const user = await prisma.user.count();
    if(user > 0) return 
    console.log("Create First Admin")
    await Register({
        username : process.env.SUPER_USER || "",
        password : process.env.SUPER_PASSWORD || "",
        role : "super_admin"
    })
}
)()

const app = express();

app.use(cookieParser())
app.use(express.json())

const api = Router()

api.use("/kandidat", KandidatRouter)
api.use("/user", UserRouter)
api.use("/pemilih", PemilihRouter)
api.use("/tim", TimRouter)
api.use("/anggota", AnggotaTimRout)
api.use("/notifikasi", NotifikasiRout)
api.use('/util', UtilRouter)
api.get("/gambar/*", (req: Request<{ 0: string }>, res) => {
    const name = req.params[0]
    if (z.string().nonempty().safeParse(name).success === false) {
        return res.status(404).send()
    }
    const imageFilePath = path.join(__dirname, 'gambar', name);
    res.sendFile(imageFilePath);
})

app.use("/api", api)



app.listen(process.env.PORT || 3379, () => {
    console.log("listening on http://localhost:"+(process.env.PORT || 3379)); 

})