import path from "node:path"

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
