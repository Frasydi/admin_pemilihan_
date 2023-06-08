import dotenv from "dotenv"
dotenv.config()
import express, { Request } from 'express';
import KandidatRouter from './middleware/kandidat';
import UserRouter from './middleware/user';
import cookieParser from "cookie-parser";
import { z } from "zod";
import path from "path";
import PemilihRouter from "./middleware/pemilih";
import TimRouter from "./middleware/tim";
import UtilRouter from "./middleware/util";
import AnggotaTimRout from "./middleware/anggota";
const app = express();

app.use(cookieParser())
app.use(express.json())

app.use("/kandidat", KandidatRouter)
app.use("/user", UserRouter)
app.use("/pemilih", PemilihRouter)
app.use("/tim", TimRouter)
app.use("/anggota", AnggotaTimRout)
app.use('/util', UtilRouter)
app.get("/gambar/*", (req: Request<{ 0: string }>, res) => {
    const name = req.params[0]
    if (z.string().nonempty().safeParse(name).success === false) {
        return res.status(404).send()
    }
    const imageFilePath = path.join(__dirname, 'gambar', name);
    res.sendFile(imageFilePath);
})
app.listen(3000, () => {
    console.log("listening on http://localhost:3000")

})