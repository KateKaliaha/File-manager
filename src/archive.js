import { createReadStream, createWriteStream } from "node:fs"
import { createBrotliCompress, createBrotliDecompress } from "node:zlib"
import { pipeline } from "node:stream"
import path from "path"
import { deleteQuotes, showDirectory } from "./helpers.js"

export const compress = async (dataToCompressFile) => {
    const [fileToCompress, ...destinationDirectory] = dataToCompressFile
    const sourcePath = path.resolve(deleteQuotes(fileToCompress))
    const parsePathToCompress = path.parse(sourcePath)
    const destinationPath = path.resolve(
        `${process.cwd()}${path.sep}${deleteQuotes(destinationDirectory)}${
            path.sep
        }${parsePathToCompress.base}.br`
    )

    const brotliCompress = createBrotliCompress()
    const source = createReadStream(sourcePath)
    const destination = createWriteStream(destinationPath)

    pipeline(source, brotliCompress, destination, (err) => {
        if (err) {
            console.log("Operation failed!")
            process.exitCode = 1
        }
    })
    await showDirectory(process.cwd())
}

export const decompress = async (dataToDecompressFile) => {
    const [fileToDecompress, ...destinationDirectory] = dataToDecompressFile
    const sourcePath = path.resolve(deleteQuotes(fileToDecompress))
    const parsePathToDecompress = path.parse(sourcePath)
    const destinationPath = path.resolve(
        `${process.cwd()}${path.sep}${deleteQuotes(destinationDirectory)}${
            path.sep
        }${parsePathToDecompress.name}`
    )

    if (parsePathToDecompress.ext === ".br") {
        const brotliDecompress = createBrotliDecompress()
        const source = createReadStream(sourcePath)
        const destination = createWriteStream(destinationPath)

        pipeline(source, brotliDecompress, destination, (err) => {
            if (err) {
                console.log("Operation failed!")
                process.exitCode = 1
            }
        })
    } else {
        console.log("Operation failed!")
    }
    await showDirectory(process.cwd())
}
