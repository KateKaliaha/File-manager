export const validateInput = (str) => {
    let validateData = ""
    const pairsQuotes =
        str.split("").filter((sign) => sign === "'").length % 2 === 0

    if (pairsQuotes) {
        if (/'/g.test(str)) {
            validateData = str
                .split(" ")
                .slice(1)
                .join(" ")
                .split("'")
                .filter((item) => item !== " " && item !== "")
                .map((item) => item.trim())

            return validateData
        }
    }

    if (str === "") {
        validateData = []

        return validateData
    }

    validateData = str.trim().split(" ").slice(1)

    return validateData
}
