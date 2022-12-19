import { writeFile } from "node:fs/promises"
import path from "path"
import {
    showDirectory,
    deleteQuotes,
    accessPath,
    generatePath,
} from "../helpers/index.js"

export const add = async (fileToWrite) => {
    if (!path.isAbsolute(fileToWrite)) {
        const pathToFile = generatePath(deleteQuotes(fileToWrite))
        const existFile = await accessPath(pathToFile)

        if (!existFile) {
            await writeFile(pathToFile, "")
                .catch(() => console.log("Operation failed!"))
                .finally(() => showDirectory(process.cwd()))
        } else {
            console.log("Operation failed!")
            showDirectory(process.cwd())
        }
    } else {
        console.log("Operation failed!")
        showDirectory(process.cwd())
    }
}
