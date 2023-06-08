import { z } from "zod";
import { LoginUser, RegisterUser } from "../service/user";
import { verifyToken } from "../util/jwt";
import { IUser, IuserAdd, Zuser, ZuserAdd } from "../types/IUser";
import { IResult } from "../types/Iresult";


export async function Register(data: IuserAdd): IResult<null> {
    const validation = ZuserAdd.safeParse(data)
    if (validation.success == false) {
        return {
            message: validation.error.issues[0].path + " : " + validation.error.issues[0].message,
            code: 400,
            status: false
        }
    }

    return await RegisterUser(validation.data)
}

export async function Login(data: IUser): IResult<{
    token: string;
    user: {
        id: number;
        username: string;
    };
}> {
    const validation = Zuser.safeParse(data)
    if (validation.success == false) {
        return {
            message: validation.error.issues[0].path + " : " + validation.error.issues[0].message,
            code: 400,
            status: false
        }
    }

    return await LoginUser(validation.data)
}

export async function Auth(token : string) {
    if (z.string().nonempty(token).safeParse(token).success === false) {
        return {
            status: false,
            code: 401,
            message: "Invalid Token, or Token must be string"
        }
    }
    const auth = verifyToken(token)
    if (auth.status === false) {
        return {
            code: 401,
            status: false,
            message: auth.message
        }
    }

    return {
        code: 200,
        status: true,
        message: auth.message,
        data: {
            username: auth.decoded?.username || "",
            id: auth.decoded?.id || ""
        }
    }

}