import { z } from "zod";

export const Zuser = z.object({
    username: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
    password: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
})

export const ZuserAdd = z.object({
    username: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
    password: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
    role: z.string().nonempty(),

})

export const ZUserNewPassword = z.object({
    password: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi"),
    newpassword: z.string().nonempty().regex(/^[^\s]+$/, "Tidak boleh ada spasi")
}
)

export type IUserNewPassword = z.infer<typeof ZUserNewPassword>
export type IuserAdd = z.infer<typeof ZuserAdd>
export type IUser = z.infer<typeof Zuser>


