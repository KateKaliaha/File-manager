import os from "node:os"

export const showDirectory = async (path) => {
    process.stdout.write(`You are currently in ${path} ${os.EOL}`)
}

export const deleteQuotes = (arr) => {
    const arrWithoutQuotes = arr.map((item) => item.replace(/"/g))
    console.log(arrWithoutQuotes)
    return arrWithoutQuotes
}
