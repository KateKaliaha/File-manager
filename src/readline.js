import { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
import { up, cd, ls } from "./navigation/index.js"
import { cat, cp, rm, rn, add, mv } from "./basicOperations/index.js"
import { handlerOs } from "./operationSystem.js"
import { hash } from "./hash.js"
import { compress, decompress } from "./archive/index.js"
import os from "node:os"
import { showDirectory, validateInput } from "./helpers/index.js"

export const readLine = (name) => {
    const rl = readline.createInterface({ input, output })
    rl.on("line", async (input) => {
        const command = input.split(" ")[0]
        const consoleInput = validateInput(input)

        switch (command) {
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
                cat(consoleInput)
                break
            }

            case "add": {
                if (consoleInput.length === 1) {
                    await add(consoleInput[0])
                } else {
                    console.log("Invalid input!")
                    await showDirectory(process.cwd())
                }
                break
            }

            case "cd": {
                if (consoleInput.length === 0) {
                    console.log("Invalid input!")
                    showDirectory(process.cwd())
                    return
                }
                cd(consoleInput)
                break
            }

            case "rn": {
                if (consoleInput.length === 2) {
                    await rn(consoleInput)
                } else {
                    console.log("Invalid input!")
                    showDirectory(process.cwd())
                }
                break
            }

            case "cp": {
                cp(consoleInput)
                break
            }

            case "mv": {
                mv(consoleInput)
                break
            }

            case "rm": {
                if (consoleInput.length === 1) {
                    rm(consoleInput)
                } else {
                    console.log("Invalid input!")
                    showDirectory(process.cwd())
                }
                break
            }

            case "os": {
                if (consoleInput.length === 1) {
                    handlerOs(consoleInput)
                } else {
                    console.log("Invalid input!")
                }
                showDirectory(process.cwd())
                break
            }

            case "hash": {
                if (consoleInput.length === 1) {
                    await hash(consoleInput)
                } else {
                    console.log("Invalid input!")
                }
                showDirectory(process.cwd())
                break
            }

            case "compress": {
                compress(consoleInput)
                break
            }

            case "decompress": {
                decompress(consoleInput)
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
