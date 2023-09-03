import { Response, Router } from "express";
import { AllUsers, Auth, Login, Register, changePassword, editUserName, removeUser } from "../controller/user";
import { AuthMiddleware, CustomRequest } from "../util/auth";

const UserRouter = Router()
UserRouter.post("/register", AuthMiddleware ,async (req ,res : Response) => {
    //@ts-ignore
    if(req.auth.role !== "super_admin") return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    const result = await Register(req.body)
    return res.status(result.code).json(result)
})

UserRouter.get("/all", AuthMiddleware,async(req,res) => {
    //@ts-ignore
    if(req.auth.role !== "super_admin") return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    const result = await AllUsers(req.query?.search as string || "")
    return res.status(result.code).json(result)
})

UserRouter.post("/login", async (req,res) => {
    const result = await Login(req.body)
    if(result.status) {
        res.cookie("token", result.data?.token, {
            maxAge: 24 * 60 * 60 * 1000,
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

UserRouter.put("/edit/:id", AuthMiddleware,async (req,res) => {
  const result = await editUserName(parseInt(req.params.id), req.body.username)
    return res.status(result.code).json(result)
})

UserRouter.put("/changePassword/:id", AuthMiddleware,async (req, res) => {
    //@ts-ignore
    if(req.auth.role !== "super_admin") return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    
    const result = await changePassword(req.body, parseInt(req.params.id))
    if(result.status) {
        return res.cookie("token", "", {maxAge : 0}).status(result.code).json(result)
    }
    return res.status(result.code).json(result)
})

UserRouter.delete("/del/:id", AuthMiddleware, async (req, res) => {
    //@ts-ignore
    if(req.auth.role !== "super_admin") return res.status(403).json({
        message : "You are not allowed to access this",
        code : 403,
        status : false
    })
    //@ts-ignore
    const result = await removeUser(parseInt(req.params.id), req.auth.id)
    return res.status(result.code).json(result)

})
export default UserRouter