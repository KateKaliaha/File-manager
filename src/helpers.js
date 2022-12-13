import os from "node:os"

export const showDirectory = async (path) => {
    process.stdout.write(`You are currently in ${path} ${os.EOL}`)
}

export const deleteQuotes = (data) => {
    let strWithoutQuotes = ""

    if (Array.isArray(data)) {
        strWithoutQuotes = data.join(" ").replace(/["']/g, "")
    } else {
        strWithoutQuotes = data.replace(/["']/g, "")
    }

    return strWithoutQuotes.trim()
}
