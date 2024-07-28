import { Router } from 'express'
import authController from './auth/auth.controller'
import staticontroller from './static/static.controller'
import appController from './app/app.controller'

const controllers = Router()

controllers.use(authController)
controllers.use(staticontroller)
controllers.use(appController)

export default controllers
