import { Request, Response, Router } from 'express'
import { prisma } from '../../database'

const appController = Router()

appController.get('/app', async (req: Request, resp: Response) => {
    try {
        const users = await prisma.user.findMany()

        resp.render('app', { users, email: req.cookies['token'] })
    } catch (error) {
        console.log('error', error)
    }
})

export default appController
