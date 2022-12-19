import {
    showDirectory,
    deleteQuotes,
    accessPath,
    generatePath,
} from "../helpers/index.js"

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
