import { createReadStream, createWriteStream } from "node:fs"
import { createBrotliCompress } from "node:zlib"
import { pipeline } from "node:stream"
import path from "path"
import {
    deleteQuotes,
    showDirectory,
    generatePath,
    accessPath,
} from "../helpers/index.js"

export const compress = async (dataToCompressFile) => {
    const [fileToCompress, ...destinationDirectory] = dataToCompressFile
    const pathToFile = generatePath(deleteQuotes(fileToCompress))
    const pathToDestinationDirectory = generatePath(
        deleteQuotes(destinationDirectory)
    )
    const extFile = path.parse(pathToFile).ext
    const existSourceFile = await accessPath(pathToFile)
    const existDestinationDirectory = await accessPath(
        pathToDestinationDirectory
    )

    if (extFile && existSourceFile && existDestinationDirectory) {
        const fileName = path.parse(pathToFile).base
        const destinationPath = path.resolve(
            `${pathToDestinationDirectory}${path.sep}${fileName}.br`
        )
        const brotliCompress = createBrotliCompress()
        const source = createReadStream(pathToFile)
        const destination = createWriteStream(destinationPath)

        pipeline(source, brotliCompress, destination, (err) => {
            if (err) {
                source.close()
                destination.close()
                console.log("Operation failed!")
                process.exitCode = 1
            }
        })
    } else {
        console.log("Operation failed!")
    }

    await showDirectory(process.cwd())
}
