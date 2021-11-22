import express from 'express'
import path from 'path'
const app = express()

const PORT = process.env.PORT ?? 3000
const __dirname = path.resolve()

let counter = 0;
app.get("/", (req, res) => {
  res.send(`<h1>Main page</h1>${counter++}`)
})




app.listen(PORT, () => {
  console.log(`On port ${PORT}`)
})
