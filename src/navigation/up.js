import path from "path"

export const up = (input) => {
    if (input.length > 0) {
        console.log("Invalid input!")
        return
    }

    let currentPath = process.cwd()
    const root = path.parse(currentPath).root

    if (root === currentPath) {
        return
    }

    const newCurrentPath = currentPath.split(path.sep).slice(0, -1)
    currentPath = newCurrentPath.join(path.sep)

    process.chdir(currentPath + path.sep)
}
