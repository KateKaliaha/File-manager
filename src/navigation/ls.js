import { readdir } from "node:fs/promises"

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
