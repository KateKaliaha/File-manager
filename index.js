import os from "node:os"
import { showDirectory } from "./src/helpers.js"
import { readLine } from "./src/readline.js"

const userData = process.argv.slice(2)
const prefix = "--username="

function startApp() {
    try {
        if (!userData[0].startsWith(prefix)) {
            throw new Error("Error: Invalid data")
        }
        let name = userData[0].slice(prefix.length).trim()
        if (!name || userData.length > 1) {
            name = "unknown user"
        }
        process.stdout.write(`Welcome to the File Manager, ${name}! ${os.EOL}`)
        process.chdir(os.homedir())
        showDirectory(process.cwd())
        readLine(name)
    } catch {
        console.log("Invalid input!")
    }
}

startApp()
