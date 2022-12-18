import { createReadStream } from "node:fs"
import {
    showDirectory,
    deleteQuotes,
    generatePath,
    accessPath,
} from "../helpers/index.js"

export const cat = async (fileToRead) => {
    const pathToFile = generatePath(deleteQuotes(fileToRead))

    const existSourceFile = await accessPath(pathToFile)
    if (existSourceFile) {
        const readTextFile = createReadStream(pathToFile)
        readTextFile.on("data", function (chunk) {
            console.log(chunk.toString())
        })
        readTextFile.on("close", () => showDirectory(process.cwd()))
        readTextFile.on("error", () => console.log("Operation failed!"))
    } else {
        console.log("Operation failed!")
        showDirectory(process.cwd())
    }
}
