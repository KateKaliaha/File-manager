export const deleteQuotes = (data) => {
    let strWithoutQuotes = ""

    if (Array.isArray(data)) {
        strWithoutQuotes = data.join(" ").replace(/["']/g, "")
    } else {
        strWithoutQuotes = data.replace(/["']/g, "")
    }

    return strWithoutQuotes.trim()
}
