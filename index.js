import process, { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
import { fileURLToPath } from "url"
import path from "path"
import os from "node:os"

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)
let currentPath = ""
const rl = readline.createInterface({ input, output })

const userData = process.argv.slice(2)
const prefix = "--username="
const name = userData[0].slice(prefix.length)

const directory = (path) => {
    process.stdout.write(`You are currently in ${path} ${os.EOL}`)
    // console.log(os.platform(), os.homedir())
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
        currentPath = process.cwd()
        directory(currentPath)
    } catch (err) {
        console.error(err.message)
    }
}
rl.on("line", (input) => {
    switch (input) {
        case ".exit": {
            rl.close()
            break
        }
        case "up": {
            up()
            directory(currentPath)
            break
        }
        default: {
            console.log(`Received: ${input}`)
        }
    }
})
rl.on("close", (input) => {
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
startApp()
