import { createReadStream, createWriteStream } from "node:fs"
import { writeFile, rename, rm as remove } from "node:fs/promises"
import path from "path"
import {
    showDirectory,
    deleteQuotes,
    generatePath,
    accessPath,
} from "./helpers.js"

export const cat = async (fileToRead) => {
    const pathToFile = generatePath(deleteQuotes(fileToRead))
    const readTextFile = createReadStream(pathToFile)
    readTextFile.on("data", function (chunk) {
        console.log(chunk.toString())
    })
    readTextFile.on("close", () => showDirectory(process.cwd()))
    readTextFile.on("error", () => console.log("Operation failed!"))
}

export const add = async (fileToWrite) => {
    await writeFile(
        `${process.cwd()}${path.sep}${deleteQuotes(fileToWrite)}`,
        ""
    )
    await showDirectory(process.cwd())
}

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

export const mv = async (dataToMove) => {
    const [fileToMove, ...directoryToMoveFile] = dataToMove
    const pathToMoveFile = generatePath(deleteQuotes(fileToMove))
    const pathToNewDirectory = generatePath(deleteQuotes(directoryToMoveFile))
    const fileName = path.parse(pathToMoveFile).base
    const existSourceFile = await accessPath(pathToMoveFile)
    const existDestinationFile = await accessPath(pathToNewDirectory)

    if (existSourceFile && existDestinationFile) {
        const pathToNewFile = `${pathToNewDirectory}${path.sep}${fileName}`
        const readTextFile = createReadStream(pathToMoveFile)
        const writeTextFile = createWriteStream(pathToNewFile, { flags: "wx" })
        readTextFile.pipe(
            writeTextFile.on("error", () => {
                readTextFile.close()
                console.log("Operation failed!")
                showDirectory(process.cwd())
            })
        )
        writeTextFile.on("finish", () => {
            remove(pathToMoveFile)
            showDirectory(process.cwd())
        })
    } else {
        console.log("Operation failed!")
        showDirectory(process.cwd())
    }
}

export const rm = async (fileToDelete) => {
    const pathToDeleteFile = generatePath(deleteQuotes(fileToDelete))
    remove(pathToDeleteFile)
        .catch(() => console.log("Operation failed!"))
        .finally(() => showDirectory(process.cwd()))
}
