import { Request, Response, Router } from 'express'

const staticontroller = Router()

staticontroller.get('/', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/hero')
        return
    }

    resp.render('index')
})

staticontroller.get('/about', (req: Request, resp: Response) => {
    const boost = !!req.headers && req.headers['hx-request']

    if (boost) {
        resp.render('snippets/about')
        return
    }

    resp.render('about')
})

export default staticontroller
