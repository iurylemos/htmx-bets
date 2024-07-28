import { Request, Response, Router } from 'express'
import { prisma } from '../../database'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const authController = Router()

authController.get('/login', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/login')
        return
    }

    resp.render('login')
})

authController.get('/logout', async (req: Request, resp: Response) => {
    try {
        resp.cookie('token', '', { maxAge: 0, httpOnly: true })
        resp.header('hx-redirect', '/login')
        resp.send('')
    } catch (error) {
        console.log('error', error)
    }
})

authController.post('/register', async (req: Request, resp: Response) => {
    try {
        const { email, password } = req.body

        const checkEmail = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (checkEmail) {
            resp.status(400).send('Email already exists')
            return
        }

        const hashedPassword = await hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        const token = sign({ id: user.id, email: user.email }, JWT_SECRET)

        resp.cookie('token', token, { maxAge: 900000, httpOnly: true })

        resp.header('hx-redirect', '/app')

        resp.status(201).send({ error: false, data: user })
    } catch (error) {
        console.log('error', error)
        resp.status(500).send({ error: true, message: error })
    }
})

authController.get('/register', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/register')
        return
    }

    resp.render('register')
})

authController.post('/login', async (req: Request, resp: Response) => {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (!user || !(await compare(password, user.password))) {
            resp.status(400).send('Invalid email or password')
            return
        }

        const token = sign({ id: user.id, email: user.email }, JWT_SECRET)

        resp.cookie('token', token, { maxAge: 900000, httpOnly: true })

        resp.header('hx-redirect', '/app')
    } catch (error) {
        console.log('error')
    }
})

export default authController
