const fetch = require("node-fetch")

const wakeDyno = (url, interval = 25) => {
    const ms = interval * 60 * 1000
    setTimeout(() => {
        try { 
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                }).then((data) => {
                }).catch((error) => {
                    console.warn(`Error while waking: ${error.message}`)
                })
        }
        catch (error) {
            console.warn(`Error while waking: ${error.message}`)
        }
        finally {
            return wakeDyno(url, interval)
        }
    }, ms)
}

module.exports = wakeDyno