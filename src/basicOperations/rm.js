import { rm as remove } from "node:fs/promises"
import { showDirectory, deleteQuotes, generatePath } from "../helpers/index.js"

export const rm = async (fileToDelete) => {
    const pathToDeleteFile = generatePath(deleteQuotes(fileToDelete))
    remove(pathToDeleteFile)
        .catch(() => console.log("Operation failed!"))
        .finally(() => showDirectory(process.cwd()))
}
