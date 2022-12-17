import { createReadStream, createWriteStream } from "node:fs"
import { rm as remove } from "node:fs/promises"
import path from "path"
import {
    showDirectory,
    deleteQuotes,
    generatePath,
    accessPath,
} from "../helpers/index.js"

export const mv = async (dataToMove) => {
    const [fileToMove, ...directoryToMoveFile] = dataToMove
    const pathToMoveFile = generatePath(deleteQuotes(fileToMove))
    const pathToNewDirectory = generatePath(deleteQuotes(directoryToMoveFile))
    const fileName = path.parse(pathToMoveFile).base
    const existSourceFile = await accessPath(pathToMoveFile)
    const existDestinationFile = await accessPath(pathToNewDirectory)

    if (existSourceFile && existDestinationFile) {
        const pathToNewFile = `${pathToNewDirectory}${path.sep}${fileName}`
        const readTextFile = createReadStream(pathToMoveFile)
        const writeTextFile = createWriteStream(pathToNewFile, { flags: "wx" })
        readTextFile.pipe(
            writeTextFile.on("error", () => {
                readTextFile.close()
                console.log("Operation failed!")
                showDirectory(process.cwd())
            })
        )
        writeTextFile.on("finish", () => {
            remove(pathToMoveFile)
            showDirectory(process.cwd())
        })
    } else {
        console.log("Operation failed!")
        showDirectory(process.cwd())
    }
}
