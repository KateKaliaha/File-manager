import { writeFile } from "node:fs/promises"
import path from "path"
import { showDirectory, deleteQuotes } from "../helpers/index.js"

export const add = async (fileToWrite) => {
    await writeFile(
        `${process.cwd()}${path.sep}${deleteQuotes(fileToWrite)}`,
        ""
    )
    await showDirectory(process.cwd())
}
