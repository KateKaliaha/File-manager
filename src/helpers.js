import os from "node:os"
import path from "node:path"
import { access } from "node:fs/promises"

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

export const generatePath = (data) => {
    if (!data) {
        return
    }
    let absolutePath = ""
    if (path.isAbsolute(data + path.sep)) {
        absolutePath = data
    } else {
        absolutePath = path.resolve(`${process.cwd()}${path.sep}${data}`)
    }

    return absolutePath
}

export const validateInput = (input) => {
    const arrWithValidateData = []
    let inputData = ""
    for (let i = 0; i < input.length; i++) {
        if (input[i] === " ") {
            arrWithValidateData.push(inputData)
            inputData = ""
        } else if (input[i] === "'") {
            arrWithValidateData.push(inputData)
            inputData = ""
            i++
            while (input[i] !== "'") {
                inputData += input[i]
                i++
            }
            arrWithValidateData.push(inputData)
            inputData = ""
        } else {
            inputData += input[i]
        }
    }
    arrWithValidateData.push(inputData)

    return arrWithValidateData.filter((item) => item !== "")
}

export const accessPath = async (path) => {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}
