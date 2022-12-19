import { createReadStream, createWriteStream } from "node:fs"
import { createBrotliDecompress } from "node:zlib"
import { pipeline } from "node:stream"
import path from "path"
import {
    deleteQuotes,
    showDirectory,
    generatePath,
    accessPath,
} from "../helpers/index.js"

export const decompress = async (dataToDecompressFile) => {
    const [fileToDecompress, ...destinationDirectory] = dataToDecompressFile
    const sourcePath = generatePath(deleteQuotes(fileToDecompress))
    const pathToDestinationDirectory = generatePath(
        deleteQuotes(destinationDirectory)
    )
    const parsePathToDecompress = path.parse(sourcePath)
    const fileName = parsePathToDecompress.name
    const destinationPath = path.resolve(
        `${pathToDestinationDirectory}${path.sep}${fileName}`
    )
    const existSourceFile = await accessPath(sourcePath)
    const existDestinationDirectory = await accessPath(
        pathToDestinationDirectory
    )

    if (
        parsePathToDecompress.ext === ".br" &&
        existSourceFile &&
        existDestinationDirectory
    ) {
        const source = createReadStream(sourcePath)
        const brotliDecompress = createBrotliDecompress()

        const destination = createWriteStream(destinationPath)
        pipeline(source, brotliDecompress, destination, (err) => {
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
