import express from 'express'
import dotenv from 'dotenv'
import { Liquid } from 'liquidjs'
import cookieParser from 'cookie-parser'
import controllers from './controllers'

dotenv.config()

const application = express()
const PORT = process.env.PORT || 3000

const liquidEngine = new Liquid()

// express.config
application.use(express.static('public'))
application.use(express.json())
application.use(express.urlencoded({ extended: true }))
application.use(cookieParser())

// liquid.config
application.engine('liquid', liquidEngine.express())
application.set('views', './src/views')
application.set('view engine', 'liquid')

// controllers [routes]
application.use(controllers)

application.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`)
})
