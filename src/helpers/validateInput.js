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
