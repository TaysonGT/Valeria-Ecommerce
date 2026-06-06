import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

const userSerivce = new UserService()

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await userSerivce.registerUser(req.body)
      return res.status(201).json({ success: true, user })
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' })
      }

      const user = await userSerivce.validateCredentials(username, password)
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' })
      }

      const token = userSerivce.generateToken(user)
      return res.json({ success: true, token, user: userSerivce.sanitizeUser(user) })
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  async me(req: any, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Not authenticated' })
      }
      const user = await userSerivce.findUserById(req.user.id)
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }
      return res.json({ success: true, user: userSerivce.sanitizeUser(user) })
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }
}
