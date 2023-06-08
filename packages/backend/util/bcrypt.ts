import bcrypt from 'bcrypt'

export function HashingPassword(password : string) {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    return hash
}

export function comparePassword(plain : string, hashed : string) {
    return bcrypt.compareSync(plain, hashed)
}