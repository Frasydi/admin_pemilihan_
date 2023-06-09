import { NextFunction, Request, Response } from "express"
import { Auth } from "../controller/user"

export interface CustomRequest extends Request {
    auth: any;
  }

export async function AuthMiddleware(req  :Request, res : Response, next : NextFunction) {
    try {
        const auth = await Auth(req.cookies.token || "")
        if(!auth.status) {
            return res.status(401).send()
        }
        if(auth.data == null) {
            return res.status(401).send()
        }
        //@ts-ignore
        req.auth = auth.data
        next()
    }catch(err) {
        console.log(err)
        return res.status(401).send()
    }
}