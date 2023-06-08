import { NextFunction, Request, Response } from "express"
import { Auth } from "../controller/user"

export async function AuthMiddleware(req : Request, res : Response, next : NextFunction) {
    try {
        const auth = await Auth(req.cookies.token || "")
        if(!auth.status) {
            return res.status(401).send()
        }
        next()
    }catch(err) {
        console.log(err)
        return res.status(401).send()
    }
}