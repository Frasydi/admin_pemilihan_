import { z } from "zod";

export const ZKandidatAdd = z.object({
    nik: z.string().nonempty(),
    nama: z.string().nonempty(),
    alamat: z.string().nonempty(),
    kelurahan: z.string().nonempty(),
    kecamatan: z.string().nonempty(),
  });

export type IKandidatAdd = z.infer<typeof ZKandidatAdd>