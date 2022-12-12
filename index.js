import process, { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
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
import { createBrotliCompress, createBrotliDecompress } from "node:zlib"
import { pipeline } from "node:stream"
import { showDirectory } from "./src/helpers.js"
import { up, cd, ls } from "./src/navigation.js"

let currentPath = ""

const userData = process.argv.slice(2)
const prefix = "--username="
let name = userData[0].slice(prefix.length).trim()

function startApp() {
    try {
        if (!userData[0].startsWith(prefix)) {
            throw new Error("Error: Invalid data")
        }
        if (!name || userData.length > 1) {
            name = "unknown user"
        }
        process.stdout.write(`Welcome to the File Manager, ${name}! ${os.EOL}`)
        process.chdir(os.homedir())
        // currentPath = os.homedir()
        showDirectory(process.cwd())
        const rl = readline.createInterface({ input, output })
        rl.on("line", async (input) => {
            const consoleInput = input.trim().split(" ")

            switch (consoleInput[0]) {
                case ".exit": {
                    rl.close()
                    break
                }

                case "up": {
                    up(consoleInput)
                    showDirectory(process.cwd())
                    break
                }

                case "ls": {
                    await ls(consoleInput)
                    showDirectory(process.cwd())
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
                    if (consoleInput.length === 1) {
                        console.log("Invalid input!")
                        showDirectory(process.cwd())
                        return
                    }
                    cd(consoleInput.slice(1).join(" "))
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

                case "compress": {
                    try {
                        if (consoleInput.length === 3) {
                            compress(consoleInput.slice(1))
                            // await directory(currentPath)
                        } else {
                            console.log(`Error in compress`)
                        }
                        break
                    } catch {
                        console.log(`Error in compress!`)
                        await directory(currentPath)
                    }
                }

                case "decompress": {
                    try {
                        if (consoleInput.length === 3) {
                            decompress(consoleInput.slice(1))
                            // await directory(currentPath)
                        } else {
                            console.log(`Error in compress`)
                        }
                        break
                    } catch {
                        console.log(`Error in compress!`)
                        await directory(currentPath)
                    }
                }

                default: {
                    console.log("Invalid input!")
                }
            }
        })
        rl.on("close", () => {
            console.log(
                `Thank you for using File Manager, ${name}, goodbye! ${os.EOL}`
            )
        })
        // showDirectory(currentPath)
    } catch {
        console.log("Invalid input!")
    }
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
    const contents = await readFile(pathToFile, { encoding: "utf8" }).catch(
        () => {
            console.log("Error in hash!")
        }
    )
    console.log(createHash("sha256").update(contents).digest("hex"))
}

async function compress(files) {
    const [sourceFile, destinationDirectory] = files
    const sourcePath = path.resolve(sourceFile)
    const nameFile = path.parse(sourcePath)
    const destinationPath = path.resolve(
        `${currentPath}${path.sep}${destinationDirectory}${path.sep}${nameFile.base}.br`
    )

    const brotliCompress = createBrotliCompress()
    const source = createReadStream(sourcePath)
    const destination = createWriteStream(destinationPath)

    pipeline(source, brotliCompress, destination, (err) => {
        if (err) {
            console.error("Error in compress")
            process.exitCode = 1
        }
    })
    await directory(currentPath)
}
async function decompress(files) {
    const [sourceFile, destinationDirectory] = files
    const sourcePath = path.resolve(sourceFile)
    const nameFile = path.parse(sourcePath)
    const destinationPath = path.normalize(
        `${currentPath}${path.sep}${destinationDirectory}${path.sep}${nameFile.name}`
    )

    const brotliDecompress = createBrotliDecompress()
    const source = createReadStream(sourcePath)
    const destination = createWriteStream(destinationPath)

    pipeline(source, brotliDecompress, destination, (err) => {
        if (err) {
            console.error("Error in decompress")
            process.exitCode = 1
        }
    })
    await directory(currentPath)
}
startApp()
