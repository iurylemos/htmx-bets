import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { prisma } from './database'
import { Liquid } from 'liquidjs'
import cookieParser from 'cookie-parser'

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

application.post('/register', async (req: Request, resp: Response) => {
    try {
        console.log('body', req.body)

        const { email, password } = req.body

        const user = await prisma.user.create({
            data: {
                email,
                password,
            },
        })

        resp.cookie('token', email, { maxAge: 900000, httpOnly: true })

        resp.header('hx-redirect', '/app')

        resp.status(201).send({ error: false, data: user })
    } catch (error) {
        console.log('error', error)
        resp.status(500).send({ error: true, message: error })
    }
})

application.get('/app', async (req: Request, resp: Response) => {
    try {
        const users = await prisma.user.findMany()

        resp.render('app', { users, email: req.cookies['token'] })
    } catch (error) {
        console.log('error', error)
    }
})

application.get('/logout', async (req: Request, resp: Response) => {
    try {
        resp.cookie('token', '', { maxAge: 0, httpOnly: true })
        resp.header('hx-redirect', '/login')
        resp.send('')
    } catch (error) {
        console.log('error', error)
    }
})

application.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`)
})
