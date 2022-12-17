import os from "node:os"

export const showDirectory = async (path) => {
    process.stdout.write(`You are currently in ${path} ${os.EOL}`)
}
