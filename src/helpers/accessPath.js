import { access } from "node:fs/promises"

export const accessPath = async (pathToCheck) => {
    try {
        await access(pathToCheck)
        return true
    } catch {
        return false
    }
}
