import { createReadStream, createWriteStream } from "node:fs"
import { readdir, writeFile, rename, rm as remove } from "node:fs/promises"
import path from "path"
import { showDirectory, deleteQuotes } from "./helpers.js"

export const cat = async (fileToRead) => {
    const readTextFile = createReadStream(
        path.resolve(deleteQuotes(fileToRead))
    )
    readTextFile.on("data", function (chunk) {
        console.log(chunk.toString())
    })
    readTextFile.on("end", () => showDirectory(process.cwd()))
    readTextFile.on("error", () => console.log("Invalid input!"))
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
        await rename(
            `${process.cwd()}/${deleteQuotes(oldName)}`,
            `${process.cwd()}/${deleteQuotes(newName)}`
        )
    } catch {
        console.log("Operation failed!")
    } finally {
        showDirectory(process.cwd())
    }
}

export const cp = async (dataForCopyFile) => {
    try {
        const [fileToCopy, ...directoryToWriteFile] = dataForCopyFile
        const pathToDirectory = path.resolve(
            `${process.cwd()}${path.sep}${deleteQuotes(directoryToWriteFile)}`
        )
        const readNewDirectory = await readdir(pathToDirectory)
        const readOldDirectory = await readdir(`${process.cwd()}`)

        if (readOldDirectory.includes(fileToCopy) && readNewDirectory) {
            const pathToNewFile = `${pathToDirectory}${path.sep}${deleteQuotes(
                fileToCopy
            )}`
            const readTextFile = createReadStream(
                path.resolve(deleteQuotes(fileToCopy))
            )
            await writeFile(pathToNewFile, "")
            const writeTextFile = createWriteStream(pathToNewFile)
            readTextFile.pipe(writeTextFile)
        } else {
            console.log("Operation failed!")
        }
    } catch {
        console.log("Operation failed!")
    } finally {
        showDirectory(process.cwd())
    }
}

export const mv = async (dataToMove) => {
    try {
        const [fileToMove, ...directoryToMoveFile] = dataToMove
        const pathToNewDirectory = path.resolve(
            `${process.cwd()}${path.sep}${deleteQuotes(directoryToMoveFile)}`
        )
        const readOldDirectory = await readdir(`${process.cwd()}`)
        const readNewDirectory = await readdir(pathToNewDirectory)

        if (
            readOldDirectory.includes(deleteQuotes(fileToMove)) &&
            readNewDirectory
        ) {
            const pathToNewFile = `${pathToNewDirectory}${
                path.sep
            }${deleteQuotes(fileToMove)}`
            const readTextFile = createReadStream(
                path.resolve(deleteQuotes(fileToMove))
            )
            await writeFile(pathToNewFile, "")
            const writeTextFile = createWriteStream(pathToNewFile)
            readTextFile.pipe(writeTextFile)
            remove(`${process.cwd()}${path.sep}${deleteQuotes(fileToMove)}`)
        } else {
            console.log("Operation failed!")
        }
    } catch {
        console.log("Operation failed!")
    } finally {
        showDirectory(process.cwd())
    }
}

export const rm = async (fileToDelete) => {
    remove(`${process.cwd()}${path.sep}${deleteQuotes(fileToDelete)}`)
        .catch(() => console.log("Operation failed!"))
        .finally(() => showDirectory(process.cwd()))
}
