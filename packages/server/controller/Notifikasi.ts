import { z } from "zod";
import { IResult } from "../types/Iresult";
import { getNotifikasi } from "../service/Notifikasi";
import { notifikasi } from "@prisma/client";


export async function findNotifikasi() :IResult<notifikasi[]>{
    
    return await getNotifikasi()

}