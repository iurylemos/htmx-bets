import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { prisma } from './database'
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

// routes
application.use(controllers)

application.get('/db', async (req: Request, resp: Response) => {
    try {
        const total = await prisma.todo.count()
        resp.send({ total })
    } catch (error) {
        console.log('error')
    }
})

application.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`)
})
