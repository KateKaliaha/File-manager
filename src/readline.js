import { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
import { up, cd, ls } from "./navigation.js"
import { cat, cp, rm, rn, add, mv } from "./basicOperations.js"
import { handlerOs } from "./operationSystem.js"
import { hash } from "./hash.js"
import { compress, decompress } from "./archive.js"
import os from "node:os"
import { showDirectory, validateInput } from "./helpers.js"

export const readLine = (name) => {
    const rl = readline.createInterface({ input, output })
    rl.on("line", async (input) => {
        const consoleInput = validateInput(input)

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
                compress(consoleInput.slice(1))
                break
            }

            case "decompress": {
                decompress(consoleInput.slice(1))
                break
            }

            default: {
                console.log("Invalid input!")
                showDirectory(process.cwd())
            }
        }
    })
    rl.on("close", () => {
        console.log(
            `Thank you for using File Manager, ${name}, goodbye! ${os.EOL}`
        )
    })
}
