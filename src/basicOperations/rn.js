import { rename } from "node:fs/promises"
import path from "path"
import { showDirectory, deleteQuotes, generatePath } from "../helpers/index.js"

export const rn = async (names) => {
    try {
        const [oldName, newName] = names
        const pathToRenameFile = generatePath(deleteQuotes(oldName))
        const directoryToPath = path.parse(pathToRenameFile).dir
        const pathToNewFile = `${directoryToPath}${path.sep}${deleteQuotes(
            newName
        )}`
        await rename(pathToRenameFile, pathToNewFile)
    } catch {
        console.log("Operation failed!")
    } finally {
        showDirectory(process.cwd())
    }
}
