import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { deleteQuotes, generatePath } from "./helpers/index.js"

export const hash = async (fileToHash) => {
    const pathToFile = generatePath(deleteQuotes(fileToHash))
    await readFile(pathToFile, { encoding: "utf8" })
        .then((data) => {
            const hashInfo = createHash("sha256").update(data).digest("hex")
            console.log(hashInfo)
        })
        .catch(() => {
            console.log("Operation failed!")
        })
}
