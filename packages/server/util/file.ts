import * as fs from "fs"
import sharp from "sharp"
export async function saveFile(fileName : string, content : string) {
    try {
    const newName = duplicateFile(fileName)
        await sharp(fs.readFileSync(content)).webp({quality : 50}).toFile("gambar/"+newName)
        return newName
    }catch(err) {
        console.log(err)
        return null
    }
}

function duplicateFile(filename : string) {
    const directory = fs.readdirSync("gambar")
    let newName = filename.split(".").slice(0, -1).join(".")
    let i = 1;
    while(directory.includes(newName)) {
        newName = `${newName}[${i++}]`
    }
    return newName+".webp"
}

export function deleteFile(filename : string) {
    try {
        fs.unlinkSync("gambar/"+filename)
    }catch(err) {
        console.log(err)
    }
}