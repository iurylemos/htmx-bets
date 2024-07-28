import { Request, Response, Router } from 'express'
import { prisma } from '../../database'

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
        console.log('body', req.body)

        const { email, password } = req.body

        resp.send({ ok: true })
    } catch (error) {
        console.log('error')
    }
})

export default authController
