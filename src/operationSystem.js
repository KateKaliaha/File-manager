import os from "node:os"

export const handlerOs = async (command) => {
    switch (command) {
        case "--EOL": {
            const eol = JSON.stringify(os.EOL)
            console.log(eol)
            break
        }
        case "--cpus": {
            const cpus = os.cpus()
            const infoCpus = cpus.map(
                (item) => (item = { model: item.model, speed: item.speed })
            )
            console.table(infoCpus)
            break
        }
        case "--homedir": {
            console.log(os.homedir())
            break
        }
        case "--username": {
            console.log(os.userInfo().username)
            break
        }
        case "--architecture": {
            console.log(os.arch())
            break
        }
        default: {
            console.log("Invalid input!")
        }
    }
}
