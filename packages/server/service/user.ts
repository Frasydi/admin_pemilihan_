import { Prisma } from "@prisma/client"
import prisma from "../prisma/prisma"
import { HashingPassword, comparePassword } from "../util/bcrypt"
import { createToken } from "../util/jwt"
import { IUser, IUserNewPassword, IuserAdd } from "../types/IUser"

export async function RegisterUser(data: IuserAdd) {
    try {
        const user = await prisma.user.create({
            data: {
                ...data,
                password: HashingPassword(data.password)
            }
        })

        return {
            code: 200,
            status: true,
            message: "OK"
        }
    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // check if error is because data is already present 
            if (err.code == "P2002") {
                return {
                    code: 400,
                    message: "Duplicate data",
                    status: false
                }
            }

            return {
                code: 400,
                message: err.message,
                status: false
            }
        }
        return {
            code: 500,
            message: "Server Error",
            status: false
        }
    }
}

export async function LoginUser(data: IUser) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })
        if (user == null) {
            return {
                code: 404,
                message: 'User not found',
                status: false
            }
        }

        const compare = comparePassword(data.password, user.password)
        if (compare === false) {
            return {
                code: 400,
                message: "Invalid password",
                status: false
            }
        }

        const token = createToken(user)
        console.log(token)
        return {
            code: 200,
            message: "Success Login",
            data: {
                token: token, user: {
                    id: user.id,
                    username: user.username,
                    role : user.role
                }
            },
            status: true
        }
    } catch (err) {
        console.log(err)
        return {
            code: 500,
            message: "Server Error",
            status: false
        }
    }
}


export async function changeUserPassword({password, newpassword}: IUserNewPassword, id: number) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id
            }
        })
        if (user == null) {
            return {
                code: 404,
                message: 'User not found',
                status: false
            }
        }

        const compare = comparePassword(password, user.password)
        if (compare === false) {
            return {
                code: 400,
                message: "Invalid password",
                status: false
            }
        }

        await prisma.user.update({
            where : {
                id
            },
            data : {
                password : HashingPassword(newpassword)
            }
        })
        return {
            code: 200,
            message: "Success Login",
            
            status: true
        }
    } catch (err) {
        console.log(err)
        return {
            code: 500,
            message: "Server Error",
            status: false
        }
    }
}