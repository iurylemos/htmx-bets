import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { prisma } from './database'
import { Liquid } from 'liquidjs'

dotenv.config()

const application = express()
const PORT = process.env.PORT || 3000

const liquidEngine = new Liquid()

application.use(express.static('public'))

application.engine('liquid', liquidEngine.express())
application.set('views', './src/views')
application.set('view engine', 'liquid')

application.use(express.json())
application.use(express.urlencoded({ extended: true }))

application.get('/', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/hero')
        return
    }

    resp.render('index')
})

application.get('/about', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/about')
        return
    }

    resp.render('about')
})

application.get('/login', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/login')
        return
    }

    resp.render('login')
})

application.get('/register', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/register')
        return
    }

    resp.render('register')
})

application.get('/db', async (req: Request, resp: Response) => {
    try {
        const total = await prisma.todo.count()
        resp.send({ total })
    } catch (error) {
        console.log('error')
    }
})

application.post('/login', async (req: Request, resp: Response) => {
    try {
        console.log('body', req.body)

        const { email, password } = req.body

        resp.send({ ok: true })
    } catch (error) {
        console.log('error')
    }
})

application.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`)
})
