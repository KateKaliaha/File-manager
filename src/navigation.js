import path from "path"
import { readdir } from "node:fs/promises"
import {
    showDirectory,
    deleteQuotes,
    accessPath,
    generatePath,
} from "./helpers.js"

export const up = (input) => {
    if (input.length > 1) {
        console.log("Invalid input!")
        return
    }

    let currentPath = process.cwd()
    const root = path.parse(currentPath).root

    if (root === currentPath) {
        return
    }

    const newCurrentPath = currentPath.split(path.sep).slice(0, -1)
    currentPath = newCurrentPath.join(path.sep)

    process.chdir(currentPath + path.sep)
}

export const ls = async (input) => {
    if (input.length > 1) {
        console.log("Invalid input!")
        return
    }

    const files = await readdir(process.cwd(), { withFileTypes: true })
    const directory = []
    const filesInDirectory = []

    files.map((file) => {
        if (file.isDirectory()) {
            directory.push({ name: file.name, type: "directory" })
        }
        if (file.isFile()) {
            filesInDirectory.push({ name: file.name, type: "file" })
        }
    })

    const list = [
        ...directory.sort((a, b) => a.name.localeCompare(b.name)),
        ...filesInDirectory.sort((a, b) => a.name.localeCompare(b.name)),
    ]

    console.table(list)
}

export const cd = async (directory) => {
    try {
        const newDirectoryPath = generatePath(deleteQuotes(directory))
        const existDestinationPath = await accessPath(newDirectoryPath)

        if (existDestinationPath) {
            process.chdir(newDirectoryPath)
        } else {
            console.log("Operation failed!")
        }
    } catch {
        console.log("Operation failed!")
    } finally {
        showDirectory(process.cwd())
    }
}
