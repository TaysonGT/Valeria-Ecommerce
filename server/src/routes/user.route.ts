import express from 'express'
import { UserController } from '../controllers/user.controller'
import { auth } from '../middlewares/auth.middleware'

const userRouter = express.Router()
const userController = new UserController()

userRouter.post('/auth/register', (req, res, next) => {
  void userController.register(req, res).catch(next)
})
userRouter.post('/auth/login', (req, res, next) => {
  void userController.login(req, res).catch(next)
})
userRouter.get('/me', auth, (req, res, next) => {
  void userController.me(req as any, res).catch(next)
})

export default userRouter
