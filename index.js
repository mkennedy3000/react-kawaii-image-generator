const execa     = require('execa')
const express   = require('express')
const fs        = require('fs')
const {resolve, join} = require("path")

const app = express()
const port = 3000

app.get('/ice-cream', async (req, res) => {
    // get config from query params
    const color  = req.query.color ? `#${req.query.color}` : '#FDA7DC'
    const mood   = req.query.mood || 'blissful'
    const size   = req.query.size || 300

    // repng requires exact dimensions
    const width = size / 2
    const height = size

    // determine image name
    const imageDir = __dirname + '/images'
    const imageName = `ice-cream-${color}-${mood}-${size}.png`
    const fullPath = join(imageDir, imageName)

    // return image if already generated
    if (fs.existsSync(fullPath)) {
        return res.sendFile(fullPath)
    }

    // create image directory if it doesn't exist
    if (!fs.existsSync(imageDir)){
        fs.mkdirSync(imageDir);
    }

    // generate the image
    await execa(resolve('./node_modules/repng/cli.js'), [
        resolve('./IceCream.js'),
        '-w', width,
        '-h', height,
        '-d', imageDir,
        '-f', imageName,
        '-p', JSON.stringify({ color, mood, size })
    ])

    // return the image
    return res.sendFile(fullPath)
})

app.listen(port, () => console.log(`React Kawaii image generator listening on port ${port}!`))