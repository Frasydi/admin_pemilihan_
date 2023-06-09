export type IResult<T> = Promise<
    {
        message : string,
        code : number,
        status : boolean,
        data? : T
    }
>