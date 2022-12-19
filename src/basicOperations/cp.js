import { createReadStream, createWriteStream } from "node:fs"
import path from "path"
import {
    showDirectory,
    deleteQuotes,
    generatePath,
    accessPath,
} from "../helpers/index.js"

export const cp = async (dataForCopyFile) => {
    const [fileToCopy, ...directoryToWriteFile] = dataForCopyFile
    const pathToCopyFile = generatePath(deleteQuotes(fileToCopy))
    const pathToNewDirectory = generatePath(deleteQuotes(directoryToWriteFile))
    const fileName = path.parse(pathToCopyFile).base
    const existSourceFile = await accessPath(pathToCopyFile)
    const existDestinationFile = await accessPath(pathToNewDirectory)

    if (existSourceFile && existDestinationFile) {
        const pathToNewFile = `${pathToNewDirectory}${path.sep}${fileName}`
        const readTextFile = createReadStream(pathToCopyFile)
        const writeTextFile = createWriteStream(pathToNewFile, { flags: "wx" })
        readTextFile.pipe(
            writeTextFile.on("error", () => {
                readTextFile.close()
                console.log("Operation failed!")
            })
        )
        writeTextFile.on("close", () => {
            showDirectory(process.cwd())
        })
    } else {
        console.log("Operation failed")
        showDirectory(process.cwd())
    }
}
