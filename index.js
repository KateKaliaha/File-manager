import process, { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
import path from "path"
import os from "node:os"
import { createReadStream, createWriteStream } from "node:fs"
import { createBrotliCompress, createBrotliDecompress } from "node:zlib"
import { pipeline } from "node:stream"
import { showDirectory } from "./src/helpers.js"
import { up, cd, ls } from "./src/navigation.js"
import { cat, cp, rm, rn, add, mv } from "./src/basicOperations.js"
import { handlerOs } from "./src/operationSystem.js"
import { hash } from "./src/hash.js"

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
                    cat(consoleInput.slice(1).join(" "))
                    break
                }

                case "add": {
                    if (consoleInput.length === 2) {
                        await add(consoleInput.slice(1).join(" "))
                    } else {
                        console.log("Invalid input!")
                        await showDirectory(process.cwd())
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
                    if (consoleInput.length === 3) {
                        await rn(consoleInput.slice(1))
                    } else {
                        console.log("Invalid input!")
                        showDirectory(process.cwd())
                    }
                    break
                }

                case "cp": {
                    cp(consoleInput.slice(1))
                    break
                }

                case "mv": {
                    mv(consoleInput.slice(1))
                    break
                }

                case "rm": {
                    if (consoleInput.length === 2) {
                        rm(consoleInput.slice(1).join(" "))
                    } else {
                        console.log("Invalid input!")
                        showDirectory(process.cwd())
                    }
                    break
                }

                case "os": {
                    if (consoleInput.length === 2) {
                        handlerOs(consoleInput.slice(1).join(" "))
                    } else {
                        console.log("Invalid input!")
                    }
                    showDirectory(process.cwd())
                    break
                }

                case "hash": {
                    if (consoleInput.length === 2) {
                        await hash(consoleInput.slice(1).join(" "))
                    } else {
                        console.log("Invalid input!")
                    }
                    showDirectory(process.cwd())
                    break
                }

                case "compress": {
                    try {
                        if (consoleInput.length === 3) {
                            compress(consoleInput.slice(1))
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
    } catch {
        console.log("Invalid input!")
    }
}

// async function hash(fileToHash) {
//     const pathToFile = path.resolve(fileToHash)
//     const contents = await readFile(pathToFile, { encoding: "utf8" }).catch(
//         () => {
//             console.log("Error in hash!")
//         }
//     )
//     console.log(createHash("sha256").update(contents).digest("hex"))
// }

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
