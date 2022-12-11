import process, { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
import { fileURLToPath } from "url"
import path from "path"
import os from "node:os"
import {
    readdir,
    writeFile,
    rename,
    rm as remove,
    readFile,
} from "node:fs/promises"
import { createReadStream, createWriteStream } from "node:fs"
import { createHash } from "node:crypto"

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)
let currentPath = ""
const rl = readline.createInterface({ input, output })

const userData = process.argv.slice(2)
const prefix = "--username="
const name = userData[0].slice(prefix.length)

const directory = async (path) => {
    process.stdout.write(`You are currently in ${path} ${os.EOL}`)
    // console.log(process.chdir(os.homedir()), os.homedir(), process.cwd())
}

function startApp() {
    try {
        if (userData.length > 1) {
            throw new Error("Error: Invalid data")
        }
        if (!userData[0].startsWith(prefix)) {
            throw new Error("Error: Invalid data")
        }
        process.stdout.write(`Welcome to the File Manager, ${name}! ${os.EOL}`)
        // process.chdir(os.homedir())
        currentPath = os.homedir()
        // directory(process.cwd())
        directory(currentPath)
    } catch (err) {
        console.error(err.message)
    }
}
rl.on("line", async (input) => {
    const consoleInput = input.trim().split(" ")

    switch (consoleInput[0]) {
        case ".exit": {
            rl.close()
            break
        }
        case "up": {
            up()
            directory(currentPath)
            break
        }
        case "ls": {
            await ls()
            await directory(currentPath)
            break
        }
        case "cat": {
            try {
                if (consoleInput.length === 2) {
                    await cat(consoleInput.slice(1).join(" "))
                } else {
                    console.log(`Error`)
                }
            } catch {
                console.log("Error")
            } finally {
            }
            break
        }

        case "add": {
            if (consoleInput.length === 2) {
                await add(consoleInput.slice(1).join(" "))
                await directory(currentPath)
            } else {
                console.log(`Error`)
            }
            break
        }
        case "cd": {
            if (consoleInput.length === 2) {
                cd(consoleInput.slice(1).join(" "))
            } else {
                console.log(`Error`)
                directory(currentPath)
            }
            break
        }
        case "rn": {
            console.log(consoleInput)
            if (consoleInput.length === 3) {
                await rn(consoleInput.slice(1))
                await directory(currentPath)
            } else {
                console.log(`Error`)
            }
            break
        }
        case "cp": {
            if (consoleInput.length === 3) {
                cp(consoleInput.slice(1))
                // await directory(currentPath)
            } else {
                console.log(`Error`)
            }
            break
        }
        case "mv": {
            try {
                if (consoleInput.length === 3) {
                    mv(consoleInput.slice(1))
                    // await directory(currentPath)
                } else {
                    console.log(`Error`)
                }
                break
            } catch {
                console.log(`Error in mv!`)
                await directory(currentPath)
            }
        }
        case "rm": {
            if (consoleInput.length === 2) {
                rm(consoleInput.slice(1).join(" "))
            } else {
                console.log(`Error`)
                directory(currentPath)
            }
            break
        }
        case "os": {
            if (consoleInput.length === 2) {
                handlerOs(consoleInput.slice(1).join(" "))
            } else {
                console.log(`Error`)
            }
            directory(currentPath)
            break
        }
        case "hash": {
            try {
                if (consoleInput.length === 2) {
                    hash(consoleInput.slice(1).join(" "))
                    await directory(currentPath)
                } else {
                    console.log(`Error`)
                    await directory(currentPath)
                }
                break
            } catch {
                console.log(`Error in mv!`)
                await directory(currentPath)
            }
        }
        default: {
            console.log(`Received: ${input}`)
        }
    }
})
rl.on("close", () => {
    console.log(`Thank you for using File Manager, ${name}, goodbye! ${os.EOL}`)
})

function up() {
    const root = path.parse(currentPath).root
    if (root === currentPath) {
        return currentPath
    }
    const newCurrentPath = currentPath.split(path.sep).slice(0, -1)
    currentPath = newCurrentPath.join(path.sep)
    if (currentPath === "") {
        currentPath = root
    }
}

async function ls() {
    const files = await readdir(currentPath, { withFileTypes: true })
    const directory = []
    const filesOffDirectory = []

    files.map((file) => {
        if (file.isDirectory()) {
            directory.push({ name: file.name, type: "directory" })
        }
        if (file.isFile()) {
            filesOffDirectory.push({ name: file.name, type: "file" })
        }
    })
    const list = [
        ...directory.sort((a, b) => a.name.localeCompare(b.name)),
        ...filesOffDirectory.sort((a, b) => a.name.localeCompare(b.name)),
    ]

    console.table(list)
}

async function cat(fileToRead) {
    const readTextFile = createReadStream(path.resolve(fileToRead))
    readTextFile.on("data", function (chunk) {
        console.log(chunk.toString())
    })
    readTextFile.on("end", () => directory(currentPath))
    readTextFile.on("error", () => console.log("Error"))
}

async function add(fileToWrite) {
    await writeFile(`${currentPath}${path.sep}${fileToWrite}`, "")
}

async function cd(file) {
    try {
        if (file === "..") {
            up()
            directory(currentPath)
        } else {
            const filePath = path.resolve(currentPath, file)
            // process.chdir(filePath)
            // console.log(process.cwd())
            if (path.isAbsolute(file)) {
                const files = await readdir(file, { withFileTypes: true })
                if (files) {
                    currentPath = file
                    directory(currentPath)
                }
            } else {
                const files = await readdir(filePath, { withFileTypes: true })
                if (files) {
                    currentPath = filePath
                    directory(currentPath)
                }
            }
        }
    } catch {
        console.log("Error")
        directory(currentPath)
    }
}

async function rn(names) {
    try {
        const [oldName, newName] = names
        await rename(`${currentPath}/${oldName}`, `${currentPath}/${newName}`)
    } catch {
        console.log("Error in rn!")
    }
}

async function cp(names) {
    try {
        const [fileToRead, directoryToWrite] = names
        const pathToDirectory = path.normalize(
            `${currentPath}${path.sep}${directoryToWrite}`
        )
        const files = await readdir(pathToDirectory, { withFileTypes: true })
        if (files) {
            const readTextFile = createReadStream(path.resolve(fileToRead))
            await writeFile(`${pathToDirectory}${path.sep}${fileToRead}`, "")
            const writeTextFile = createWriteStream(
                `${pathToDirectory}${path.sep}${fileToRead}`
            )
            readTextFile.pipe(writeTextFile)
            await directory(currentPath)
        }
    } catch {
        console.log("Error in cp!")
        await directory(currentPath)
    }
}

async function mv(names) {
    try {
        const [fileToRead, directoryToWrite] = names
        const pathToDirectory = path.normalize(
            `${currentPath}${path.sep}${directoryToWrite}`
        )
        const files = await readdir(pathToDirectory, { withFileTypes: true })
        const filesToMove = await readdir(`${currentPath}`, {
            withFileTypes: true,
        })
        if (files && filesToMove.includes(fileToRead)) {
            const readTextFile = createReadStream(path.resolve(fileToRead))
            await writeFile(`${pathToDirectory}${path.sep}${fileToRead}`, "")
            const writeTextFile = createWriteStream(
                `${pathToDirectory}${path.sep}${fileToRead}`
            )
            readTextFile.pipe(writeTextFile)
            remove(`${currentPath}${path.sep}${fileToRead}`)
            await directory(currentPath)
        } else {
            console.log("Error in mv!")
            await directory(currentPath)
        }
    } catch {
        console.log("Error in mv!")
        await directory(currentPath)
    }
}

async function rm(fileToDelete) {
    remove(`${currentPath}${path.sep}${fileToDelete}`)
        .then(() => directory(currentPath))
        .catch(() => {
            console.log("Error in rm!")
            directory(currentPath)
        })
}

async function handlerOs(command) {
    switch (command) {
        case "--EOL": {
            const eol = JSON.stringify(os.EOL)
            console.log(eol)
            break
        }
        case "--cpus": {
            const cpus = os.cpus()
            const info = cpus.map(
                (item) => (item = { model: item.model, speed: item.speed })
            )
            console.table(info)
            break
        }
        case "--homedir": {
            console.log(os.homedir())
            break
        }
        case "--username": {
            console.log(os.userInfo().username)
            break
        }
        case "--architecture": {
            console.log(os.arch())
            break
        }
        default: {
            console.log("Error in os!")
        }
    }
}

async function hash(fileToHash) {
    const pathToFile = path.resolve(fileToHash)
    console.log(pathToFile)
    const contents = await readFile(pathToFile, { encoding: "utf8" }).catch(
        () => {
            console.log("Error in hash!")
        }
    )
    console.log(createHash("sha256").update(contents).digest("hex"))
}
startApp()
