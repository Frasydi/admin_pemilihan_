import jwt, { Jwt } from "jsonwebtoken"

export function createToken(user : {id : number, username : string, password : string, role : string, kelurahan? : string | null}) {
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        role : user.role,
        kelurahan : user.kelurahan

    }, process.env.SECRET_KEY || "", { expiresIn: "1h" })
    return token
}

export function verifyToken(token : string) : {message : string, status : boolean, decoded? : {username : string, id : number, role : string, kelurahan : string}} {
    try {
        const decoded : any = jwt.verify(token, process.env.SECRET_KEY || "");
        return {
            status : true,
            decoded,
            message : "Ok"
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Token has expired');
            return {
                status : false,
                message : 'Token has expired'
            };
        } else {
            
            return {
                status : false,
                message : 'Invalid JWT'
            }
        }
    }
}