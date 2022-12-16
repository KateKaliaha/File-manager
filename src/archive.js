import { createReadStream, createWriteStream } from "node:fs"
import { createBrotliCompress, createBrotliDecompress } from "node:zlib"
import { pipeline } from "node:stream"
import path from "path"
import {
    deleteQuotes,
    showDirectory,
    generatePath,
    accessPath,
} from "./helpers.js"

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
