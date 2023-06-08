import { Router } from "express";
import { Auth, Login, Register } from "../controller/user";

const UserRouter = Router()

UserRouter.post("/register", async (req,res) => {
    const result = await Register(req.body)
    return res.status(result.code).json(result)
})

UserRouter.post("/login", async (req,res) => {
    const result = await Login(req.body)
    if(result.status) {
        res.cookie("token", result.data?.token, {
            maxAge: 3600000,
        }).status(result.code).json(result)
        return
    }
    return res.status(result.code).json(result)   
})

UserRouter.get("/logout", async(req,res) => {
    res.cookie("token", "", {maxAge : 0}).status(200).send()
})

UserRouter.get("/auth", async (req,res) => {
    console.log(req.cookies)
    const result = await Auth(req.cookies?.token || "")
    if(result.status === false) {
        res.cookie("token", "", {maxAge : 0}).status(result.code).json(result)
        return
    }
    return res.status(result.code).json(result)
})

export default UserRouter