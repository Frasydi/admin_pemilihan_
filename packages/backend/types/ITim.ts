import { z } from "zod";

export const ZTimAdd = z.object({
    nama : z.string().nonempty(),
    kecamatan : z.string().nonempty(),
})

export type ITimAdd = z.infer<typeof ZTimAdd>