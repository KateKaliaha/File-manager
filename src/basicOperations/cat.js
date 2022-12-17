import { createReadStream } from "node:fs"
import { showDirectory, deleteQuotes, generatePath } from "../helpers/index.js"

export const cat = async (fileToRead) => {
    const pathToFile = generatePath(deleteQuotes(fileToRead))
    const readTextFile = createReadStream(pathToFile)
    readTextFile.on("data", function (chunk) {
        console.log(chunk.toString())
    })
    readTextFile.on("close", () => showDirectory(process.cwd()))
    readTextFile.on("error", () => console.log("Operation failed!"))
}
