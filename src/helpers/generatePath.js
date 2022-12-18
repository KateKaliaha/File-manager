import path from "node:path"

export const generatePath = (data) => {
    if (!data) {
        return
    }
    let absolutePath = ""
    if (path.isAbsolute(data + path.sep)) {
        const parsePathExt = path.parse(data).ext
        if (!parsePathExt) {
            absolutePath = data + path.sep
        } else {
            absolutePath = data
        }
    } else {
        absolutePath = path.resolve(`${process.cwd()}${path.sep}${data}`)
    }

    return absolutePath
}
