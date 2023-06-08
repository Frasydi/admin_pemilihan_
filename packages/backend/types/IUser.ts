import { z } from "zod";

export const Zuser = z.object({
    username : z.string().nonempty(),
    password : z.string().nonempty(),
})

export const ZuserAdd =z.object({
    username : z.string().nonempty(),
    password : z.string().nonempty(),
    role : z.string().nonempty(),
    
})
export type IuserAdd = z.infer<typeof ZuserAdd>
export type IUser = z.infer<typeof Zuser>


